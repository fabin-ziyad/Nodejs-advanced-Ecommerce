var express = require("express");
var router = express.Router();;
const fs = require("fs");
const dateConvert = require("../middleware/dateConvert");
const adminCategoryController = require("../controllers/Admin/Categories");
const adminProductController = require("../controllers/Admin/Products");
const adminProfileController = require("../controllers/Admin/admin");
const fetchAllUsers=require('../common-functions/fetchAllUser')
const markShipment=require('../controllers/Admin/shipment')
const adminOrderController=require('../controllers/Admin/orders')
const adminShipmentContorller=require('../controllers/Admin/shipment')
verifyLogin = (req, res, next) => {
  if (req.session.AdminLogged) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

/*AUTHENTICATION*/

/* GET authentications/admin-login.hbs page . */
router.get("/login", (req, res) => {
  if (req.session.AdminLogged) {
    res.redirect("/admin/");
  }
  res.render("admin/authentications/admin-login", {
    loginErr: req.session.adminLoginError,
    AdminData: req.session.admin,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Login to admin panel from login page */

router.post("/login", (req, res) => {
  adminProfileController.adminLogin(req.body).then((response) => {
    if (response.DataResponse) {
      req.session.admin = response.AdminData;
      req.session.AdminLogged = true;
      res.redirect("/admin/");
    } else {
      res.redirect("/admin/login");
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Logout Page */
router.get("/logout", verifyLogin, (req, res) => {
  req.session.admin = null;
  req.session.AdminLogged = false;
  res.redirect("/admin/login");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET authentications/admin-login */
router.get("/", async (req, res) => {
  adminProductController.activeProducts().then((ActiveCounts) => {
    adminProductController.inactiveProducts().then((InactiveCounts) => {
      adminProfileController.getAdmin().then((AdminData) => {
        res.render("admin/index", {
          ActiveCounts,
          InactiveCounts,
          AdminData: req.session.admin,
        });
        // res.send(AdminData)
      });
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET add-product.hbs page */
router.get("/Add-Product", verifyLogin, (req, res) => {
  adminCategoryController.getMainCategories().then((AllMainCat) => {
    adminCategoryController.getAllSubCategories().then((AllSubcat) => {
      res.render("admin/Admin-products/add-product", {
        AllMainCat,
        AllSubcat,
        AdminData: req.session.admin,
      });
      // res.send(AllMainCat)
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Adding product to database. */
router.post("/add-product", (req, res) => {
  adminProductController.addProduct(req.body).then((responseId) => {
    let ProductImages = req.files;
    var firstImage = ProductImages.Image1;
    var secondImage = ProductImages.Image2;
    var thirdImage = ProductImages.Image3;
    var foruthImage = ProductImages.Image4;
    var folderName = responseId;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync("./public/assets/img/products/" + folderName);
      }
    } catch (err) {
      console.error(err);
    }
    if (responseId) {
      if (firstImage) {
        firstImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}1.jpg`
        );
      }
      if (secondImage) {
        secondImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}2.jpg`
        );
      }
      if (thirdImage) {
        thirdImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}3.jpg`
        );
      }
      if (foruthImage) {
        foruthImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}4.jpg`
        );
      }
    }
  });
  res.redirect("/admin/Add-Product");
});

router.post("/UpdateProduct", (req, res) => {
  adminProductController.updateProduct(req.body).then((responseId) => {
    let ProductImages = req.files;
    if (ProductImages) {
      var firstImage = ProductImages.Image1;
      var secondImage = ProductImages.Image2;
      var thirdImage = ProductImages.Image3;
      var foruthImage = ProductImages.Image4;
      if (firstImage) {
        firstImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}1.jpg`
        );
      }
      if (secondImage) {
        secondImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}2.jpg`
        );
      }
      if (thirdImage) {
        thirdImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}3.jpg`
        );
      }
      if (foruthImage) {
        foruthImage.mv(
          `./public/assets/img/products/${responseId}/${responseId}4.jpg`
        );
      }
    }

    res.redirect("/admin/list-products");
  });
});

router.post("/DeleteProduct", (req, res) => {
  adminProductController.deleteProduct(req.body).then((response) => {
    var DeleteImgs = `./public/assets/img/products/${response}`;
    try {
      fs.rmdirSync(DeleteImgs, { recursive: true });
      console.log(`${DeleteImgs} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${DeleteImgs}`);
    }
    res.redirect("/admin/Inactive-products");
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET list-products.hbs page . */
router.get("/list-products", (req, res) => {
  adminProductController.listProducts().then((productlists) => {
    adminCategoryController.getMainCategories().then((AllMainCat) => {
      res.render("admin/Admin-products/list-products", {
        productlists,
        AllMainCat,
        AdminData: req.session.admin,
      });
    });
    //  res.send(productlists)
  });
});

router.get("/Inactive-products", verifyLogin, (req, res) => {
  adminProductController.listProducts().then((productlists) => {
    res.render("admin/Admin-inactives/Inactive-Products", {
      productlists,
      AdminData: req.session.admin,
    });
  });
});

router.post("/DisableProduct", (req, res) => {
  adminProductController.disbaleProduct(req.body.ProductId).then(() => {
    res.json({ status: true });
  });
});

router.post("/EnableProduct", (req, res) => {
  adminProductController.enableProduct(req.body.ProductId).then(() => {
    res.json({ status: true });
  });
});

router.get("/Product-View", async (req, res) => {
  let DetailedView = await adminProductController.getProductDetails(req.query.id);
  res.render("admin/Admin-products/Product-View", {
    DetailedProduct: DetailedView,
    AdminData: req.session.admin,
  });
  // res.send(DetailedView)
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET grid-view-products.hbs page . */
router.get("/grid-view-products", verifyLogin, function (req, res, next) {
  res.render("admin/Admin-products/grid-view", {
    AdminData: req.session.admin,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET main-category.hbs page */
router.get("/main-category", verifyLogin, (req, res, next) => {
  adminCategoryController.getMainCategories().then((AllMainCat) => {
    adminCategoryController.getAllSubCategories().then((AllSubCat) => {
      res.render("admin/Admin-categories/main-category", {
        AllMainCat,
        AllSubCat,
        AdminData: req.session.admin,
      });
      // res.send(AllMainCat)
    });
  });
});

/*     Adding main category with its image.      */
router.post("/add-main-category", (req, res) => {
  adminCategoryController.addMainCategory(req.body).then((id) => {
    let thumbImage = req.files.image;
    if (thumbImage) {
      thumbImage.mv(
        "./public/assets/category-thumb/" + id + ".jpg",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/main-category");
          } else {
            console.log(err);
            res.send("POST " + err);
          }
        }
      );
    } else {
      res.redirect("/admin/main-category/");
    }
  });
});

/* Update main-category. */
router.post("/UpdateMainCat", (req, res) => {
  adminCategoryController.updateMainCategory(req.body).then((id) => {
    let updateId = req.body.ID;
    let updateImage = req.files;
    if (updateImage) {
      let updateImageFile = req.files.Image;
      if (updateImageFile) {
        updateImageFile.mv(
          "./public/assets/category-thumb/" + updateId + ".jpg"
        );
      }
    }
    res.redirect("/admin/main-category");
  });
});

router.post("/DeleteMainCat", (req, res) => {
  let MainCatImage =
    "./public/assets/category-thumb/" + req.body.MainCatId + ".jpg";
  adminCategoryController.deleteMainCategory(req.body).then(() => {
    fs.unlinkSync(MainCatImage);
    res.redirect("/admin/inactive-Maincategories");
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET sub-category.hbs page . */
router.get("/sub-category", verifyLogin, (req, res) => {
  adminCategoryController.getAllSubCategories().then((AllSubCat) => {
    adminCategoryController.getMainCategories().then((AllMainCat) => {
      res.render("admin/Admin-categories/sub-category", {
        AllSubCat,
        AllMainCat,
        AdminData: req.session.admin,
      });
      // res.send(AllMainCat);
    });
  });
});

/* POST sub-category.hbs page . */
router.post("/add-sub-category", (req, res) => {
  console.log("req",req.body);
  adminCategoryController.addSubCategory(req.body).then((responseId) => {
    res.json({ status: true });
  });
});

router.post("/UpdateSubCat", (req, res) => {
  adminCategoryController.updateSubCategory(req.body).then((response) => {
    res.redirect("/admin/sub-category");
  });
});

router.get("/Inactive-subcategories", verifyLogin, (req, res) => {
  adminCategoryController.getAllSubCategories().then((AllSubCat) => {
    res.render("admin/Admin-inactives/Inactive-SubCats", {
      AllSubCat,
      AdminData: req.session.admin,
    });
  });
});

router.post("/DisableSubCat", (req, res) => {
  adminCategoryController.disableSubCategory(req.body.SubCatId).then(() => {
    res.json({ status: true });
    // res.redirect('/admin/Inactive-subcategories')
  });
});

router.post("/DeleteSubCat", (req, res) => {
  adminCategoryController.deleteSubCategory(req.body).then(() => {
    res.redirect("/admin/Inactive-subcategories");
  });
});
router.post("/EnableSubCat", (req, res) => {
  adminCategoryController.enableSubCategory(req.body.SubCatId).then(() => {
    res.json({ status: true });
    // res.redirect('/admin/Inactive-subcategories')
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ORDERS */

/* GET orders/recent-orders.hbs page . */
router.get("/add-shipment", verifyLogin, (req, res, next) => {
  res.render("admin/Admin-shipment/addShipment", {
    AdminData: req.session.admin,
  });
});

router.post("/MarkShipment", (req, res) => {
  markShipment.markShipment(req.body.OrderId).then((response) => {
    res.json(response);
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET orders/order-history.hbs page . */
router.get("/order-history", verifyLogin, (req, res, next) => {
  adminOrderController.fetchAllOrders().then((AllOrders) => {
    res.render("admin/Admin-orders/order-history", {
      AllOrders,
      AdminData: req.session.admin,
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET orders/order-details.hbs page . */
router.get("/order-details", verifyLogin, (req, res, next) => {
  adminOrderController.fetchOrderDetails(req.query.order).then((Data) => {
    if (Data !== null || Data !== undefined) {
      adminShipmentContorller.getShipment(Data.Order._id).then(async (Shipment) => {
        Shipment.updatedAt = await dateConvert.convertDate(Shipment.updatedAt);
        res.render("admin/Admin-orders/order-details", {
          Data,
          Shipment,
          AdminData: req.session.admin,
        });
      });
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET orders/invoice.hbs page . */
router.get("/invoice", verifyLogin, (req, res, next) => {
  res.render("admin/Admin-orders/invoice", { AdminData: req.session.admin });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*REVIEWS*/

/* GET reviews/products-reviews.hbs page . */
router.get("/review", verifyLogin, (req, res, next) => {
  res.render("admin/reviews/products-reviews", {
    AdminData: req.session.admin,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*BRANDS*/

/* GET brands/product-brands.hbs page . */
router.get("/brands", verifyLogin, (req, res, next) => {
  res.render("admin/brands/product-brands", { AdminData: req.session.admin });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Registered Users*/

/* GET Admin/reg-user.hbs page . */
router.get("/reg-user", verifyLogin, async(req, res) => {
 let AllUsers=await fetchAllUsers()
if(AllUsers.length>0){
  res.render("admin/Admin-reg-users/reg-users", {
    AdminData: req.session.admin,
    AllUsers,
  });
}else{
  res.redirect('/admin/')
}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/inactive-Maincategories", verifyLogin, (req, res) => {
  adminCategoryController.activeMainCategories().then((AllMainCat) => {
    res.render("admin/Admin-inactives/Inactive-MainCats", {
      AllMainCat,
      AdminData: req.session.admin,
    });
  });
});

router.post("/DisableMainCat", (req, res) => {
 adminCategoryController.disableMainCategory(req.body.MainCatId).then((response) => {
    res.json({ status: true });
  });
});

router.post("/EnableMainCat", (req, res) => {
  adminCategoryController.enableMainCategory(req.body.MainCatId).then(() => {
    res.json({ status: true });
  });
});

/*Admin*/
router.get("/Admin-Profile", verifyLogin, (req, res) => {
  adminProfileController.getAdmin().then((Admin) => {
    res.render("admin/Admin-profile", { Admin, AdminData: req.session.admin });
  });
});
router.post("/UpdateAdminProfile", (req, res) => {
  adminProfileController.updateAdmin(req.body).then(() => {});
});

//banners........
router.get("/banner", (req, res) => {
  res.render("admin/Cover/Banner");
});

router.post("/banner1", (req, res) => {
  let Banner1 = req.files.Banner1;
  Banner1.mv("./public/user/assets/images/covers/Banner_One.jpg").then(() => {
    res.redirect("/admin/banner");
  });
});

router.post("/banner2", (req, res) => {
  let Banner1 = req.files.Banner2;
  Banner1.mv("./public/user/assets/images/covers/Banner_Two.jpg").then(() => {
    res.redirect("/admin/banner");
  });
});

router.post("/banner3", (req, res) => {
  let Banner1 = req.files.Banner3;
  Banner1.mv("./public/user/assets/images/covers/Banner_Three.jpg").then(() => {
    res.redirect("/admin/banner");
  });
});

//arrivals.......
router.get("/Arrivals_Img", (req, res) => {
  res.render("admin/Cover/Arrivals");
});

router.post("/Women_Arrival", (req, res) => {
  let Banner1 = req.files.Arrival_Women;
  Banner1.mv("./public/user/assets/images/covers/Women_Arrival.jpg").then(
    () => {
      res.redirect("/admin/Arrivals_Img");
    }
  );
});
router.post("/Men_Arrival", (req, res) => {
  let Banner1 = req.files.Arrival_Men;
  Banner1.mv("./public/user/assets/images/covers/Men_Arrival.jpg").then(() => {
    res.redirect("/admin/Arrivals_Img");
  });
});

//sliders.....
router.get("/Slider", (req, res) => {
  res.render("admin/Cover/slider");
});

router.post("/First_Slider", (req, res) => {
  let Banner1 = req.files.First_Slider;
  Banner1.mv("./public/user/assets/images/covers/First_Slider.jpg").then(() => {
    res.redirect("/admin/Slider");
  });
});

router.post("/Second_Slider", (req, res) => {
  let Banner1 = req.files.Second_Slider;
  Banner1.mv("./public/user/assets/images/covers/Second_Slider.jpg").then(
    () => {
      res.redirect("/admin/Slider");
    }
  );
});

router.post("/Enable_Arrival", (req, res) => {
  adminProductController.toggleArrivals(req.body.ProductID,true).then(() => {
    res.json({ status: true });
  });
});

router.post("/Disable_Arrival", (req, res) => {
  adminProductController.toggleArrivals(req.body.ProductID,false).then(() => {
    res.json({ status: true });
  });
});

router.get("/showcase", (req, res) => {
  adminProductController.listProducts().then((productlists) => {
    res.render("admin/Admin-products/Showcase", { productlists });
  });
});

router.post("/Disable_Featured", (req, res) => {
  adminProductController.toggleFeatured(req.body.ProductID,false).then(() => {
    res.json({ status: true });
  });
});

router.post("/Enable_Featured", (req, res) => {
  adminProductController.toggleFeatured(req.body.ProductID,true).then(() => {
    res.json({ status: true });
  });
});

router.post("/Disable_TopRated", (req, res) => {
  adminProductController.toggleTopRated(req.body.ProductID,false).then(() => {
    res.json({ status: true });
  });
});

router.post("/Enable_TopRated", (req, res) => {
  adminProductController.toggleTopRated(req.body.ProductID,true).then(() => {
    res.json({ status: true });
  });
});

router.post("/update-to-StockOut", (req, res) => {
  adminProductController.toggleStock(req.body.ProductId,false).then((Response) => {
    res.json(Response);
  });
});

router.post("/update-to-InStock", (req, res) => {
  adminProductController.toggleStock(req.body.ProductId,true).then((Response) => {
    res.json(Response);
  });
});

router.get("/OutofStock", (req, res) => {
  adminProductController.fetchAllOutOfStocks().then((Products) => {
    res.render("admin/Admin-Inactives/OutOfStocks", {
      AdminData: req.session.admin,
      Products,
    });
  });
});

router.post("/updateShipment", (req, res) => {
  adminShipmentContorller.updateShipment(req.body).then((response) => {
    res.json(response);
  });
});

module.exports = router;
