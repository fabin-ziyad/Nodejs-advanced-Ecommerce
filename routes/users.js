var express = require("express");
var router = express.Router();
const dateConvert = require("../middleware/dateConvert");
const orderControllers = require("../controllers/order");
const userControllers = require("../controllers/user");
const cartController = require("../controllers/cart-wishlists");
const productControllers = require("../controllers/Products");
verifyUserLogin = (req, res, next) => {
  if (req.session.UserLogged) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET homepage. */
router.get("/", async (req, res, next) => {
  productControllers.listProducts().then(async (productlists) => {
    let DataObj = { User: req.session?.User };
    if (req.session?.User?._id !== undefined) {
      let Wishlists_Products = await cartController.getWishlists(
        req.session.User._id
      );
      let CartCount = await cartController.getCartCounts(req.session.User._id);
      // Assigning counts to session
      req.session.Wishlisted =
        Wishlists_Products.ItemCount > 0 ? Wishlists_Products.ItemCount : 0;
      req.session.CartItems = CartCount > 0 ? CartCount : 0;
      // object insertion
      (DataObj.productlists = productlists),
        (DataObj.wishlist_products = req.session.Wishlisted),
        (DataObj.CartQuantity = req.session.CartItems),
        res.render("User/index", { layout: "UserLayout", DataObj });
    } else {
      DataObj.wishlist_products = 0;
      (DataObj.CartQuantity = 0),
        res.render("User/index", { layout: "UserLayout", DataObj });
    }
  });
});

/* GET about us. */
router.get("/about", (req, res, next) => {
  let DataObj = {
    User: req.session.User,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/about", { layout: "UserLayout", DataObj });
});

/* GET cart. */
router.get("/cart", verifyUserLogin, async (req, res, next) => {
  let DataObj = { User: req.session.User };
  let CartProductsCount = await cartController.getCartCounts(
    req.session.User._id
  );
  DataObj.wishlist_products = req.session.Wishlisted;
  DataObj.CartQuantity = req.session.CartItems;
  if (CartProductsCount <= 0) {
    res.render("User/CartEmpty", { layout: "UserLayout", DataObj });
  } else {
    let TotalPrice = await orderControllers.getOrderTotal(req.session.User._id);
    (DataObj.TotalPrice = TotalPrice),
      (DataObj.CartProducts = await cartController.getCartProducts(
        req.session.User._id
      )),
      res.render("User/cart", { layout: "UserLayout", DataObj });
  }
});

router.post("/changeQuantity", verifyUserLogin, (req, res) => {
  cartController.updateCartValue(req.body).then((Response) => {
    if (Response.Status) {
      res.json({ status: true });
    }
  });
});

router.post("/add-to-cart/:id", verifyUserLogin, (req, res, next) => {
  cartController
    .addToCart(req.params.id, req.session.User._id, req.body)
    .then(async (response) => {
      if (!response.Status) {
        res.redirect("/");
      } else {
        let cartCount = await cartController.getCartCounts(
          req.session.User._id
        );
        req.session.CartItems = cartCount;
        res.redirect("/cart");
      }
    });
});
router.post("/removeFromCart", verifyUserLogin, (req, res) => {
  cartController
    .removeFromCart(req.session.User._id, req.body)
    .then(async (response) => {
      if (response) {
        let cartCount = await cartController.getCartCounts(
          req.session.User._id
        );
        req.session.CartItems = cartCount;
      }
      res.json(response);
    });
});

/* GET login. */
router.get("/login", (req, res, next) => {
  let DataObj = {
    User: req.session.User,
  };
  DataObj.LoginError = null;
  if (req.session.UserLogged) {
    DataObj.LoginError = false;
    req.session.LoginErr = false;
    res.redirect("/");
  } else {
    (DataObj.LoginError = req.session.LoginErr),
      res.render("User/login", { layout: "UserLayout", DataObj });
    req.session.LoginErr = false;
  }
});

/* GET contact. */
router.get("/contact", verifyUserLogin, (req, res, next) => {
  let DataObj = {
    User: req.session.User,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/contact", { layout: "UserLayout", DataObj });
});

/* GET Category. */
router.get("/Categories", verifyUserLogin, (req, res, next) => {
  productControllers.getMainCategories().then((MainCats) => {
    productControllers.getSubCategories().then((AllSubCats) => {
      let DataObj = {
        User: req.session.User,
        MainCategories: MainCats,
        SubCategories: AllSubCats,
        wishlist_products: req.session.Wishlisted,
        CartQuantity: req.session.CartItems,
      };
      res.render("User/Main-Categories", { layout: "UserLayout", DataObj });
    });
  });
});

router.get("/allProducts", verifyUserLogin, async (req, res) => {
  const Main = await productControllers.getMainCategories();
  if (req.query.product === undefined || req.query.product === null) {
    productControllers.listProducts().then((AllProducts) => {
      let DataObj = {
        User: req.session.User,
        Products: AllProducts,
        total: AllProducts.length,
        MainCategories: Main,
        wishlist_products: req.session.Wishlisted,
        CartQuantity: req.session.CartItems,
      };
      res.render("User/AllProducts", { layout: "UserLayout", DataObj });
    });
  } else if (req.query.product) {
    productControllers
      .filterProduct(req.query.product)
      .then((filteredProducts) => {
        let DataObj = {
          User: req.session.User,
          Products: filteredProducts,
          total: filteredProducts.length,
          MainCategories: Main,
          wishlist_products: req.session.Wishlisted,
          CartQuantity: req.session.CartItems,
        };
        res.render("User/AllProducts", { layout: "UserLayout", DataObj });
      });
  }
});
router.get("/productsUnder", verifyUserLogin, (req, res) => {
  productControllers
    .getProductsbyCategory(req.query.Subcat)
    .then((products) => {
      DataObj = {
        User: req.session.User,
        products,
        total: products.Products.length,
        wishlist_products: req.session.Wishlisted,
        CartQuantity: req.session.CartItems,
      };
      res.render("User/productsUnderSubCat", { layout: "UserLayout", DataObj });
    });
});
/* GET checkout. */
router.get("/checkout", verifyUserLogin, async (req, res, next) => {
  let Addresses = await userControllers.getDefaultAddress(req.session.User._id);
  let TotalPrice = await orderControllers.getOrderTotal(req.session.User._id);
  let DataObj = {
    User: req.session.User,
    TotalPrice: TotalPrice,
    Addresses: Addresses,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/checkout", { layout: "UserLayout", DataObj });
});

router.get("/subCategoriesUnder", verifyUserLogin, (req, res) => {
  productControllers
    .getSubCatUnderMain(req.query.MainCat)
    .then((subCategories) => {
      let DataObj = {
        User: req.session.User,
        SubCategories: subCategories,
        wishlist_products: req.session.Wishlisted,
        CartQuantity: req.session.CartItems,
      };
      res.render("User/SubCategories", { layout: "UserLayout", DataObj });
    });
});
//Address
router.post("/saveAddress", verifyUserLogin, (req, res) => {
  userControllers
    .saveAddress(req.session.User._id, req.body)
    .then((Response) => {
      if (Response.Status) res.redirect("/dashboard");
    });
});

router.post("/UpdateAddress", verifyUserLogin, (req, res) => {
  userControllers
    .updateAddress(req.session.User._id, req.body)
    .then((Response) => {
      if (Response.Status) res.redirect("/dashboard");
    });
});

router.post("/DeleteAddress", verifyUserLogin, (req, res) => {
  userControllers
    .deleteAddress(req.session.User._id, req.body)
    .then((Response) => {
      if (Response) {
        res.redirect("/dashboard");
      }
    });
});
/* GET product. */
router.get("/product", verifyUserLogin, (req, res, next) => {
  let DataObj = {
    User: req.session.User,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/product", { layout: "UserLayout", DataObj });
});

/* GET whishlist. */
router.get("/wishlist", verifyUserLogin, async (req, res, next) => {
  let Wishlists_Products = await cartController.getWishlists(
    req.session.User._id
  );
  req.session.Wishlisted = Wishlists_Products.ItemCount;
  let DataObj = {
    User: req.session.User,
    Wishlists_Products: Wishlists_Products,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/wishlist", { layout: "UserLayout", DataObj });
});

router.post("/addtoWishlist", verifyUserLogin, (req, res) => {
  cartController
    .addtoWishlist(req.body)
    .then(async (Response) => {
      let Wishlists_Products = await cartController.getWishlists(
        req.session.User._id
      );
      req.session.Wishlisted = Wishlists_Products.ItemCount;
      res.json(Response);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/RemoveFromWishlist", verifyUserLogin, (req, res) => {
  cartController
    .removefromWishlist(req.body)
    .then(async (Response) => {
      let Wishlists_Products = await cartController.getWishlists(
        req.session.User._id
      );
      req.session.Wishlisted = Wishlists_Products.ItemCount;
      res.json(Response);
    })
    .catch((err) => {
      console.log(err);
    });
});

/* GET whishlist. */
router.get("/dashboard", verifyUserLogin, async (req, res) => {
  let Addresses = await userControllers.getMyAddresses(req.session.User._id);
  let Orders = await orderControllers.getMyOrders(req.session.User._id);
  Orders?.map(async (order) => {
    order.Order_Date = await dateConvert.convertDate(order.Order_Date);
  });
  let DataObj = {
    User: req.session.User,
    Addresses: Addresses,
    Orders,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/dashboard", { layout: "UserLayout", DataObj });
});

router.get("/item", async (req, res) => {
  let Product_View = await productControllers.getProductDetail(req.query.id);
  productControllers.listProducts().then((productlists) => {
    let DataObj = {
      User: req.session.User,
      ProductDetails: Product_View,
      productlists: productlists,
      wishlist_products: req.session.Wishlisted,
      CartQuantity: req.session.CartItems,
    };
    res.render("User/product", { layout: "UserLayout", DataObj });
  });
});

router.post("/MakeDefault", verifyUserLogin, (req, res) => {
  userControllers
    .makeDefaultAddress(req.session.User._id, req.body.Address)
    .then((Response) => {
      res.json(Response);
    });
});

router.post("/RemoveDefault", verifyUserLogin, (req, res) => {
  userControllers
    .RemoveDefaultAddress(req.session.User._id, req.body.Address)
    .then((Response) => {
      res.json(Response);
    });
});

router.get("/register", (req, res, next) => {
  if (req.session.UserLogged) {
    res.redirect("/");
  } else {
    res.render("User/register", {
      layout: "UserLayout",
      User: req.session.User,
    });
  }
});
router.post("/register", (req, res) => {
  userControllers.register(req.body).then((Response) => {
    req.session.User = Response;
    req.session.UserLogged = true;
    res.redirect("/login");
  });
});

router.post("/login", (req, res, next) => {
  userControllers.userLogin(req.body).then((Response) => {
    if (Response.status) {
      req.session.User = Response.User;
      req.session.UserLogged = true;
      res.redirect("/");
    } else {
      req.session.LoginErr = true;
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.User = null;
  req.session.UserLogged = false;
  res.redirect("/");
});

router.post("/updateUser", (req, res) => {
  userControllers
    .updateProfile(req.session.User._id, req.body)
    .then((Response) => {
      if (Response.status) {
        res.redirect("/dashboard");
      } else {
        res.redirect("/");
      }
    });
});

router.get("/success", (req, res) => {
  DataObj = {
    User: req.session.User,
    wishlist_products: req.session.Wishlisted,
    CartQuantity: req.session.CartItems,
  };
  res.render("User/success", { layout: "UserLayout", DataObj });
});

router.post("/createOrder", (req, res) => {
  orderControllers
    .placeOrder(req.session.User._id, req.body)
    .then((response) => {
      if (response && req.body.method === "COD") {
        req.session.CartItems = null;
        res.json({ paymentSuccess: true });
      } else {
        orderControllers
          .generateRazorPay(
            req.session.User._id,
            response,
            req.body.TotalAmount
          )
          .then((response) => {
            res.json(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
router.post("/verifyPayment", (req, res) => {
  orderControllers
    .verify(req.body)
    .then((response) => {
      if (response.status) {
        orderControllers
          .togglePaymentStatus(req.body, req.session.User._id)
          .then((response1) => {
            res.json(response1);
          });
      }
    })
    .catch((err) => {
      console.log("err", err);
      res.json({ status: "Payment Failed" });
    });
});
router.post("/cancelOrder", (req, res) => {
  orderControllers
    .cancelOrder(req.body.orderNo)
    .then((response) => {
      if (response.status) {
        res.json(response);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
