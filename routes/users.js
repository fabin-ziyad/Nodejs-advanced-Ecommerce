var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const UserHelpers = require("../helpers/user-helpers");
const OrderHelpers=require('../helpers/order-helpers')
var objectid = require("mongodb").ObjectId;
var bcrypt = require("bcrypt");
const session = require("express-session");
const userHelpers = require("../helpers/user-helpers");
const { Db } = require("mongodb");
const dateConvert = require("../middleware/dateConvert");

verifyUserLogin = (req, res, next) => {
  if (req.session.UserLogged) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET homepage. */
router.get("/", async (req, res, next) => {
  // let CartCount = await UserHelpers.getCartCount(req.session.User._id)
  productHelpers.listProducts().then((productlists) => {
    let DataObj = {
      User: req.session.User,
      productlists: productlists,
      WCount: req.session.Wishlisted,
    };
    res.render("User/index", { layout: "UserLayout", DataObj });
  });
});

/* GET about us. */
router.get("/about", (req, res, next) => {
  let DataObj = {
    User: req.session.User,
  };
  res.render("User/about", { layout: "UserLayout", DataObj });
});

/* GET cart. */
router.get("/cart", verifyUserLogin, async (req, res, next) => {
  let CartProducts = await UserHelpers.getCartProducts(req.session.User._id);
  let DataObj = {
    User: req.session.User,
  };
  if (CartProducts.length == 0) {
    res.render("User/CartEmpty", { layout: "UserLayout", DataObj });
  } else {
    let TotalPrice = await UserHelpers.GetTotalOrderPrice(req.session.User._id);
    UserHelpers.getCartCount(req.session.User._id).then((CartQuantity) => {
      let DataObj = {
        User: req.session.User,
        CartProducts: CartProducts,
        CartQuantity: CartQuantity,
        TotalPrice: TotalPrice,
      };

      res.render("User/cart", { layout: "UserLayout", DataObj });
    });
  }
});

router.post("/changeQuantity", verifyUserLogin, (req, res) => {
  UserHelpers.ChangeQuantity(req.session.User._id, req.body).then(
    (Response) => {
      if (Response.Status) {
        res.json({ status: true });
      }
    }
  );
});

router.post("/add-to-cart/:id", verifyUserLogin, (req, res, next) => {
  UserHelpers.addtoCart(req.params.id, req.session.User._id, req.body).then(
    (response) => {
      if (!response.Status) {
        res.redirect("/");
      } else {
        res.redirect("/cart");
      }
    }
  );
});
router.post("/removeFromCart", verifyUserLogin, (req, res) => {
  UserHelpers.RemoveFromCart(req.session.User._id, req.body).then(
    (response) => {
      res.json(response);
    }
  );
});

/* GET login. */
router.get("/login", (req, res, next) => {
  if (req.session.UserLogged) {
    res.redirect("/");
  } else {
    let DataObj = {
      User: req.session.User,
      LoginError: req.session.LoginErr,
    };
    res.render("User/login", { layout: "UserLayout", DataObj });
    req.session.LoginErr = false;
  }
});

/* GET contact. */
router.get("/contact", verifyUserLogin, (req, res, next) => {
  let DataObj = {
    User: req.session.User,
  };
  res.render("User/contact", { layout: "UserLayout", DataObj });
});

/* GET Category. */
router.get("/mainCategories", verifyUserLogin, (req, res, next) => {
  productHelpers.GetMainCategories().then((MainCats) => {
    productHelpers.AllSubCategory().then((AllSubCats) => {
      let DataObj = {
        User: req.session.User,
        MainCategories: MainCats,
        SubCategories: AllSubCats,
      };
      res.render("User/Main-Categories", { layout: "UserLayout", DataObj });
    });
  });
});

router.get("/allProducts", verifyUserLogin, async (req, res) => {
  const Main = await productHelpers.GetMainCategories()
  if (req.query.product===undefined || req.query.product===null) {
    productHelpers.listProducts().then((AllProducts) => {
      let DataObj = {
        User: req.session.User,
        Products: AllProducts,
        total: AllProducts.length,
        MainCategories:Main
      };
      res.render("User/AllProducts", { layout: "UserLayout", DataObj });
    });
  } else if(req.query.product) {
    productHelpers.filterProductsByMainCat(req.query.product).then((filteredProducts) => {
      let DataObj = {
        User: req.session.User,
        Products: filteredProducts,
        total: filteredProducts.length,
        MainCategories:Main
      };
      res.render("User/AllProducts", { layout: "UserLayout", DataObj });
    });
  }
});
router.get('/productsUnder', verifyUserLogin, (req, res) => {
  productHelpers.getProductsByCategory(req.query.Subcat).then((products) => {
    DataObj = {
      User: req.session.User,
      products,
      total: products.Products.length,
    }
    res.render("User/productsUnderSubCat", { layout: "UserLayout", DataObj });
  })
})
/* GET checkout. */
router.get("/checkout", verifyUserLogin, async (req, res, next) => {
  let Addresses = await userHelpers.GetDefaultAddress(req.session.User._id);
  let TotalPrice = await UserHelpers.GetTotalOrderPrice(req.session.User._id);
  let DataObj = {
    User: req.session.User,
    TotalPrice: TotalPrice,
    Addresses: Addresses,
  };
  res.render("User/checkout", { layout: "UserLayout", DataObj });
});

router.get('/subCategoriesUnder', verifyUserLogin,(req, res) => {
  productHelpers.subCatUnderMainCat(req.query.MainCat).then((subCategories) => {
    let DataObj = {
      User: req.session.User,
      SubCategories: subCategories,
    };
    res.render('User/SubCategories', { layout: "UserLayout", DataObj })
  })
})
//Address
router.post("/saveAddress", verifyUserLogin, (req, res) => {
  userHelpers.SaveAddress(req.session.User._id, req.body).then((Response) => {
    if (Response.Status) res.redirect("/dashboard");
  });
});

router.post("/UpdateAddress", verifyUserLogin, (req, res) => {
  userHelpers.UpdateAddress(req.session.User._id, req.body).then((Response) => {
    if (Response.Status) res.redirect("/dashboard");
  });
});

router.post("/DeleteAddress", verifyUserLogin, (req, res) => {
  userHelpers.DeleteAddress(req.session.User._id, req.body).then((Response) => {
    if (Response) {
      res.redirect("/dashboard");
    }
  });
});
/* GET product. */
router.get("/product", verifyUserLogin, (req, res, next) => {
  let DataObj = {
    User: req.session.User,
  };
  res.render("User/product", { layout: "UserLayout", DataObj });
});

/* GET whishlist. */
router.get("/wishlist", verifyUserLogin, async (req, res, next) => {
  let Wishlists_Products = await UserHelpers.getWishlists(req.session.User._id);
  req.session.Wishlisted = Wishlists_Products.ItemCount;
  let DataObj = {
    User: req.session.User,
    Wishlists_Products: Wishlists_Products,
    WCount: req.session.Wishlisted,
  };
  res.render("User/wishlist", { layout: "UserLayout", DataObj });
});

router.post("/addtoWishlist", verifyUserLogin, (req, res) => {
  userHelpers.addtoWishlist(req.body).then((Response) => {
    res.json(Response);
  });
});

router.post("/RemoveFromWishlist", verifyUserLogin, (req, res) => {
  userHelpers.RemoveFromWishlist(req.body).then((Response) => {
    res.json(Response);
  });
});

/* GET whishlist. */
router.get("/dashboard", verifyUserLogin, async (req, res) => {
  let Addresses = await userHelpers.getAddressess(req.session.User._id);
  let Orders=await userHelpers.getMyOrders(req.session.User._id)
  Orders.map(async(order)=>{
    order.Order_Date=await dateConvert.convertDate(order.Order_Date);
  })
  let DataObj = {
    User: req.session.User,
    Addresses: Addresses,
    Orders,
    message: req.flash("message"),
  };
  res.render("User/dashboard", { layout: "UserLayout", DataObj });
});

router.get("/item", async (req, res) => {
  let Product_View = await productHelpers.GetProductDetails(req.query.id);
  productHelpers.listProducts().then((productlists) => {
    let DataObj = {
      User: req.session.User,
      ProductDetails: Product_View,
      productlists: productlists,
    };
    res.render("User/product", { layout: "UserLayout", DataObj });
  });
});

router.post("/MakeDefault", verifyUserLogin, (req, res) => {
  userHelpers
    .MakeDefault(req.session.User._id, req.body.Address)
    .then((Response) => {
      res.json(Response);
    });
});

router.post("/RemoveDefault", verifyUserLogin, (req, res) => {
  userHelpers
    .RemoveDefault(req.session.User._id, req.body.Address)
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
  UserHelpers.NewUser(req.body).then((Response) => {
    req.session.User = Response;
    req.session.UserLogged = true;
    res.redirect("/login");
  });
});

router.post("/login", (req, res, next) => {
  UserHelpers.LoginUser(req.body).then((Response) => {
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
  userHelpers.UpdateUser(req.session.User._id, req.body).then((Response) => {
    if (Response.status) {
      // req.flash("message", "updated successfull");
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  });
});

router.get('/success', (req, res) => {
  DataObj = {
    User:req.session.User
  }
  res.render('User/success',{layout: "UserLayout",DataObj})
})

router.post('/orderSuccess', (req, res) => {
  OrderHelpers.COD_order_Success(req.session.User._id, req.body).then((response) => {
    OrderHelpers.RemoveFromCartAfterOrder(req.session.User._id).then(() => {
     res.json(response)
    })
  })
})


module.exports = router;
