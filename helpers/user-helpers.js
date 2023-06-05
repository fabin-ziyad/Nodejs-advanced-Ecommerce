var db = require("../config/connection");
var collection = require("../config/collection");
var bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  NewUser: (ReqData) => {
    return new Promise(async (resolve, reject) => {
      // ReqData.TestingPass = ReqData.register_Password;
      ReqData.register_Password = await bcrypt.hash(
        ReqData.register_Password,
        10
      );
      let UserData = {
        register_Full_Name: ReqData.register_Full_Name,
        resgister_Mobile_Number: ReqData.resgister_Mobile_Number,
        register_Email: ReqData.register_Email,
        register_Password: ReqData.register_Password,
        display_Name:ReqData.register_Full_Name,
        User_Address: [],
        Cart_Items: [],
        Wishlists: [],
        Order_History: [],
      };
      db.get()
        .collection(collection.USERS_COLLECTION)
        .insertOne(UserData)
        .then((data) => {
          resolve(data);
        });
    });
  },
  LoginUser: (ReqData) => {
    return new Promise(async (resolve, reject) => {
      let loginSatus = false;
      let User_Details = {};
      let User = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ register_Email: ReqData.Login_email });
      if (User) {
        bcrypt
          .compare(ReqData.Login_Password, User.register_Password)
          .then((Response) => {
            if (Response) {
              let UserData = {
                register_Full_Name: User.register_Full_Name,
                _id: User._id,
                register_Email: User.register_Email,
              };
              User_Details.User = UserData;
              User_Details.status = true;
              resolve(User_Details);
            } else {
              resolve({ status: false });
            }
          });
      } else {
        console.log("login failed");
        resolve({ status: false });
      }
    });
  },
  UpdateUser: (UserId, ReqData) => {
    return new Promise(async(resolve, reject) => {
      let User=await db.get().collection(collection.USERS_COLLECTION).findOne({_id:ObjectId(UserId)})
      if (User) {
        bcrypt.compare(ReqData.CurrentPass, User.register_Password).then((Response) => {
          if (Response) {
            db.get().collection(collection.USERS_COLLECTION).updateOne({ _id: ObjectId(UserId) },
              {
                $set: {
                  register_Full_Name: ReqData.Fullname,
                  register_Email: ReqData.email,
                  display_Name: ReqData.Displayname,
                }
              }).then(() => {
                console.log("updated");
                resolve({ Status: true })
              })
          } else {
            console.log("password error");
            resolve({ Status: false })
          }
        })
      } else {
        console.log('user Not found');
        resolve({ Status: false })

      }
    })
  },
  addtoCart: (ProductId, UserId, ReqData) => {
    ReqData.qty = parseInt(ReqData.qty); //converting to integer
    return new Promise(async (resolve, reject) => {
      //Creating Object with product id and req.body data
      let CartItemsObj = {
        UniqueId: new ObjectId(),
        item: ObjectId(ProductId),
        quantity: ReqData.qty,
        color: ReqData.Colour,
        Size: ReqData.size,
      };
      //Removed the unwanted fields and saved to new bject updatedObject
      const { quantity, color, Size, ...updatedObject } = CartItemsObj;

      //fetching the User's cart
      let UserCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(UserId) });
      if (UserCart) {
        //Finding the index of product to check exists. If exists the array return 0 else array return -1
        let ProductExists = UserCart.products.findIndex(
          (ProductsIndexs) =>
            ProductsIndexs.item == ProductId &&
            ProductsIndexs.color == ReqData.Colour &&
            ProductsIndexs.Size == ReqData.size
        );
        //If product exists increment its qauntity according to req.body.qty
        if (ProductExists != -1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              {
                user: ObjectId(UserId),
                "products.item": ObjectId(ProductId),
              },
              {
                $inc: { "products.$.quantity": ReqData.qty },
              }
            );

          resolve({ Status: true });
          //if product not exists ,add the object to products array under an user
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectId(UserId) },
              {
                $push: { products: CartItemsObj },
              }
            )
            .then(() => {
              //Adding the UsercartItem object to Cart_Items Array inside this user's collection
              db.get()
                .collection(collection.USERS_COLLECTION)
                .updateOne(
                  { _id: ObjectId(UserId) },
                  {
                    $push: { Cart_Items: updatedObject },
                  }
                )
                .then(() => {
                  resolve({ Status: true });
                });
            });
        }
      } //Creating a Cart under user if user havent cart
      else {
        let CartObj = {
          user: ObjectId(UserId),
          Total: parseInt(0),
          products: [CartItemsObj],
        };

        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(CartObj)
          .then(() => {
            //Adding the UsercartItem object to Cart_Items Array inside this user's collection
            db.get()
              .collection(collection.USERS_COLLECTION)
              .updateOne(
                { _id: ObjectId(UserId) },
                {
                  $push: { Cart_Items: updatedObject },
                }
              )
              .then(() => {
                resolve({ Status: true });
              });
          });
      }
    });
  },
  getCartProducts: (UserId) => {
    return new Promise(async (resolve, reject) => {
      //Check cart exists under this user
      let CartExists = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(UserId) });

      //return false if no cart exists
      if (!CartExists) {
        console.log("Cart not exists");
        resolve({ Status: false });
      } else {
        //Fetching details,price according to qty of products inside products array if cart exists
        let CartProducts = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .aggregate([
            {
              $match: { user: ObjectId(UserId) },
            },
            {
              $unwind: "$products",
            },
            {
              $project: {
                UniqueId: "$products.UniqueId",
                item: "$products.item",
                quantity: "$products.quantity",
                color: "$products.color",
                size: "$products.Size",
              },
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "item",
                foreignField: "_id",
                as: "CartItems",
              },
            },
            {
              $project: {
                UniqueId: 1,
                item: 1,
                quantity: 1,
                color: 1,
                size: 1,
                products: { $arrayElemAt: ["$CartItems", 0] },
              },
            },
            {
              $project: {
                UniqueId: 1,
                item: 1,
                quantity: 1,
                color: 1,
                size: 1,
                products: 1,
                total: {
                  $sum: {
                    $multiply: [
                      "$quantity",
                      { $toInt: "$products.ProductPrice" },
                    ],
                  },
                },
              },
            },
          ])
          .toArray();
        resolve(CartProducts);
      }
    });
  },
  getCartCount: (UserId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let Cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(UserId) });
      if (Cart) {
        count = Cart.products.length;
      }
      resolve(count);
    });
  },
  ChangeQuantity: (UserId,ReqData) => {
    ReqData.Count = parseInt(ReqData.Count);
    return new Promise((resolve, reject) => {
      if (ReqData.Count == -1 && ReqData.Quantity == 1) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              user: ObjectId(ReqData.Userid),
              "products.UniqueId": ObjectId(ReqData.Productid),
            },
            {
              $pull: { products: { UniqueId: ObjectId(ReqData.Productid) } },
            }
          );
        resolve({ Status: true });
      } else {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              user: ObjectId(ReqData.Userid),
              "products.UniqueId": ObjectId(ReqData.Productid),
            },
            {
              $inc: { "products.$.quantity": ReqData.Count },
            }
          );
        resolve({ Status: true });
      }
    });
  },
  RemoveFromCart: (UserId,CartnProductData) => {
    return new Promise(async (resolve, reject) => {
      let user = await db.get().collection(collection.USERS_COLLECTION).findOne({ _id: ObjectId(UserId) })
      if (user.Cart_Items.length <=1) {
        db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { _id: ObjectId(CartnProductData.Cart) },
          {
            $pull: {
              products: {
                UniqueId: ObjectId(CartnProductData.Product_To_Remove),
              },
            },
          }
        )
        .then(() => {
          //Removes the product id and unique id from user collection
          db.get()
            .collection(collection.USERS_COLLECTION)
            .updateOne(
              { _id: ObjectId(CartnProductData.UserId) },
              {
                $pull: {
                  Cart_Items: {
                    UniqueId: ObjectId(CartnProductData.Product_To_Remove),
                  },
                },
              }
            )
            .then(() => {
              resolve({Empty:true});
            });
        });
      } else {

      //Removes the product from cart
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { _id: ObjectId(CartnProductData.Cart) },
          {
            $pull: {
              products: {
                UniqueId: ObjectId(CartnProductData.Product_To_Remove),
              },
            },
          }
        )
        .then(() => {
          //Removes the product id and unique id from user collection
          db.get()
            .collection(collection.USERS_COLLECTION)
            .updateOne(
              { _id: ObjectId(CartnProductData.UserId) },
              {
                $pull: {
                  Cart_Items: {
                    UniqueId: ObjectId(CartnProductData.Product_To_Remove),
                  },
                },
              }
            )
            .then(() => {
              resolve({Empty:false});
            });
        });
      }
    });
  },
  GetTotalOrderPrice: (UserId) => {
    return new Promise(async (resolve, reject) => {
      let CartProductsPrice = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(UserId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "CartItems",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              products: { $arrayElemAt: ["$CartItems", 0] },
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              products: 1,
              total: {
                $sum: {
                  $multiply: [
                    "$quantity",
                    { $toInt: "$products.ProductPrice" },
                  ],
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: [
                    "$quantity",
                    { $toInt: "$products.ProductPrice" },
                  ],
                },
              },
            },
          },
        ])
        .toArray();
      let totalprice = parseInt(CartProductsPrice[0]?.total);
      if (!totalprice || totalprice===undefined || totalprice==null) {
        resolve({Status:false})
      } else {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { user: ObjectId(UserId) },
          {
            $set: { total: totalprice },
          }
        )
        .then(() => {
          resolve(CartProductsPrice[0]);
        });
      }
    });
  },
  addtoWishlist: (ReqData) => {
    console.log(ReqData);
    return new Promise(async (resolve, reject) => {
      let WishlistProduct = {
        Wishlist_UniqueId: new ObjectId(),
        Products: ObjectId(ReqData.Product),
        InStock: true,
      };
      let User = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: ObjectId(ReqData.User) });
      let ProductExists = User.Wishlists.findIndex(
        (ObjIndexes) => ObjIndexes.Products == ReqData.Product
      );
      if (ProductExists >= 0) {
        console.log("Already Exists in wishlist");
        resolve({ Status: false });
      } else if ((ProductExists = -1)) {
        db.get()
          .collection(collection.USERS_COLLECTION)
          .updateOne(
            { _id: ObjectId(ReqData.User) },
            {
              $push: { Wishlists: WishlistProduct },
            }
          );
        resolve({ Status: true });
      }
    });
  },
  getWishlists: (UserId) => {
    return new Promise(async (resolve, reject) => {
      let User = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: ObjectId(UserId) });
      if (User.Wishlists != -1) {
        let WishlistItems = await db
          .get()
          .collection(collection.USERS_COLLECTION)
          .aggregate([
            {
              $match: { _id: ObjectId(UserId) },
            },
            {
              $unwind: "$Wishlists",
            },
            {
              $project: {
                Products: "$Wishlists.Products",
                Wishlist_UniqueId: "$Wishlists.Wishlist_UniqueId",
                InStock: "$Wishlists.InStock",
              },
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "Products",
                foreignField: "_id",
                as: "ProductData",
              },
            },
            {
              $project: {
                Whislist_Products: { $arrayElemAt: ["$ProductData", 0] }, //to remove the array
              },
            },
            {
              $project: {
                _id: 0,
                Product_Id: "$Whislist_Products._id",
                ProductName: "$Whislist_Products.ProductName",
                ProductPrice: "$Whislist_Products.ProductPrice",
                MainCategory: "$Whislist_Products.MainCategory",
                SubCategory: "$Whislist_Products.SubCategory",
                InStock: "$Whislist_Products.InStock",
              },
            },
          ])
          .toArray();
        WishlistItems.ItemCount = WishlistItems.length;
        // console.log(WishlistItems);
        resolve(WishlistItems);
      } else {
        console.log("Nothing in wishlist");
        resolve({ Status: false });
      }
    });
  },
  RemoveFromWishlist: (ReqData) => {
    // console.log("###",ReqData);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          { _id: ObjectId(ReqData.User) },
          {
            $pull: { Wishlists: { Products: ObjectId(ReqData.Product) } },
          }
        )
        .then(() => {
          resolve({ Status: true });
        });
    });
  },
  SaveAddress: (UserId, ReqData) => {
    return new Promise(async (resolve, reject) => {
      let Address = {
        Address_UniqueId: new ObjectId(),
        First_Name: ReqData.FirstName,
        Last_Name: ReqData.LastName,
        Company_Name: ReqData.CompanyName,
        Country: ReqData.Country,
        Street_Address: ReqData.StreetAddress,
        Street_Address1: ReqData.StreetAddress1,
        City: ReqData.City,
        State: ReqData.State,
        Zip_Code: ReqData.ZipCode,
        Phone_Number: ReqData.PhoneNumber,
        Email: ReqData.EmailAddress,
        Default: false,
      };
      let User = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: ObjectId(UserId) });
      if (
        !User.User_Address ||
        User.User_Address === undefined ||
        User.User_Address.length == 0
      ) {
        let DefaultAddress = {
          Address_UniqueId: new ObjectId(),
          First_Name: ReqData.FirstName,
          Last_Name: ReqData.LastName,
          Company_Name: ReqData.CompanyName,
          Country: ReqData.Country,
          Street_Address: ReqData.StreetAddress,
          Street_Address1: ReqData.StreetAddress1,
          City: ReqData.City,
          State: ReqData.State,
          Zip_Code: ReqData.ZipCode,
          Phone_Number: ReqData.PhoneNumber,
          Email: ReqData.EmailAddress,
          Default: true,
        };
        db.get()
          .collection(collection.USERS_COLLECTION)
          .updateOne(
            { _id: ObjectId(UserId) },
            {
              $push: { User_Address: DefaultAddress },
            }
          )
          .then(() => {
            resolve({ Status: true });
          });
      } else if (User.User_Address) {
        let default_Addresses = User.User_Address.filter(
          (users) => users.Default == true
        );
        if (default_Addresses) {
          db.get()
            .collection(collection.USERS_COLLECTION)
            .updateOne(
              { _id: ObjectId(UserId) },
              {
                $push: { User_Address: Address },
              }
            )
            .then(() => {
              resolve({ Status: true });
            });
        }
      }
    });
  },
  getAddressess: (UserId) => {
    return new Promise(async (resolve, reject) => {
      let Addresses = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .aggregate([
          {
            $match: { _id: ObjectId(UserId) },
          },
          {
            $unwind: "$User_Address",
          },
          {
            $project: {
              Address_UniqueId: "$User_Address.Address_UniqueId",
              First_Name: "$User_Address.First_Name",
              Last_Name: "$User_Address.Last_Name",
              Company_Name: "$User_Address.Company_Name",
              Country: "$User_Address.Country",
              Street_Address: "$User_Address.Street_Address",
              Street_Address1: "$User_Address.Street_Address1",
              City: "$User_Address.City",
              State: "$User_Address.State",
              Zip_Code: "$User_Address.Zip_Code",
              Phone_Number: "$User_Address.Phone_Number",
              Email: "$User_Address.Email",
              Default: "$User_Address.Default",
            },
          },
        ])
        .toArray();
      resolve(Addresses);
    });
  },
  UpdateAddress: (UserId, ReqData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(UserId),
            "User_Address.Address_UniqueId": ObjectId(ReqData.AddressId),
          },
          {
            $set: {
              "User_Address.$.First_Name": ReqData.FirstName,
              "User_Address.$.Last_Name": ReqData.LastName,
              "User_Address.$.Company_Name": ReqData.companyName,
              "User_Address.$.Email": ReqData.Email,
              "User_Address.$.Street_Address": ReqData.Street_Address,
              "User_Address.$.Street_Address1": ReqData.Street_Address1,
              "User_Address.$.City": ReqData.City,
              "User_Address.$.State": ReqData.State,
              "User_Address.$.Country": ReqData.Country,
              "User_Address.$.Zip_Code": ReqData.Zip_Code,
              "User_Address.$.Phone_Number": ReqData.Phone_Number,
            },
          }
        )
        .then(() => {
          resolve({ Status: true });
        });
    });
  },
  DeleteAddress: (UserId, ReqData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          { _id: ObjectId(UserId) },
          {
            $pull: {
              User_Address: { Address_UniqueId: ObjectId(ReqData.AddressId) },
            },
          }
        )
        .then(async () => {
          let Addresses = await db
            .get()
            .collection(collection.USERS_COLLECTION)
            .findOne({ _id: ObjectId(UserId) });
          if (!Addresses.User_Address.length == 0) {
            let firstUser_Address = Addresses.User_Address[0].Address_UniqueId;
            db.get()
              .collection(collection.USERS_COLLECTION)
              .updateOne(
                {
                  "User_Address.Address_UniqueId": ObjectId(firstUser_Address),
                },
                {
                  $set: { "User_Address.$.Default": true },
                }
              )
              .then(() => {
                resolve({ Status: true });
              });
          } else {
            resolve({ Status: false });
          }
        });
    });
  },
  MakeDefault: (UserId, ReqData) => {
    return new Promise(async (resolve, reject) => {
      let User = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: ObjectId(UserId) });

      let defult_Addresses = User.User_Address.filter(
        (users) => users.Default == true
      );
      if (defult_Addresses) {
        if (defult_Addresses.length <= 1) {
          let ExistingAddressId = defult_Addresses[0].Address_UniqueId;
          db.get()
            .collection(collection.USERS_COLLECTION)
            .updateOne(
              {
                _id: ObjectId(UserId),
                "User_Address.Address_UniqueId": ObjectId(ExistingAddressId),
              },
              {
                $set: { "User_Address.$.Default": false },
              }
            )
            .then(async () => {
              await db
                .get()
                .collection(collection.USERS_COLLECTION)
                .updateOne(
                  {
                    _id: ObjectId(UserId),
                    "User_Address.Address_UniqueId": ObjectId(ReqData),
                  },
                  {
                    $set: { "User_Address.$.Default": true },
                  }
                )
                .then(() => {
                  resolve({ Status: true });
                });
            });
        }
      } else {
        console.log("maxlimit");
        resolve({ MaxLimit: true });
      }
    });
  },
  GetDefaultAddress: (UserId)=>{
    return new Promise(async(resolve, reject) => {
      const DefAddr = await db.get().collection(collection.USERS_COLLECTION).findOne({ _id: ObjectId(UserId) })
      const address = DefAddr.User_Address.filter((addr) => addr.Default === true)
      resolve(address[0])
    })
  },
  RemoveDefault: (UserId, ReqData) => {
    return new Promise(async (resolve, reject) => {
      let UserAddress = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne(
          { _id: ObjectId(UserId) },
          { User_Address: { $elemMatch: { Default: true } } }
        );
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(UserId),
            "User_Address.Address_UniqueId": ObjectId(ReqData),
          },
          {
            $set: { "User_Address.$.Default": false },
          }
        )
        .then(() => {
          resolve({ Status: true });
        });
    });
  },

  getMyOrders: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let OrdersData = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
            $match: { User: ObjectId(userId) }
          },
          {
            $unwind: "$Products"
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "Products.item",
              foreignField: "_id",
              as: "productData"
            }
          },
          {
            $unwind: "$productData"
          },
          {
            $group: {
              _id: {
                _id: "$_id",
                Address: "$Address",
                Payment_Method: "$Payment_Method",
                Total_Amount: "$Total_Amount",
                Order_Date: "$Order_Date",
                Status: "$Status",
                Order_no: "$Order_no"
              },
              products: {
                $push: {
                  _id: "$productData._id",
                  ProductName: "$productData.ProductName",
                  Colors: "$productData.Colors",
                  Gender: "$productData.Gender",
                  ProductSize: "$productData.ProductSize",
                  ProductPrice: "$productData.ProductPrice",
                  ProductQuantity: "$productData.ProductQuantity",
                  InStock: "$productData.InStock",
                  orderedQuantity: "$Products.quantity"
                }
              },
              productsCount: { $sum: 1 } // Count the number of products in each order
            }
          },
          {
            $project: {
              _id: "$_id._id",
              Address: "$_id.Address",
              Payment_Method: "$_id.Payment_Method",
              Total_Amount: "$_id.Total_Amount",
              Order_Date: "$_id.Order_Date",
              Status: "$_id.Status",
              Order_no: "$_id.Order_no",
              products: 1,
              productsCount: 1
            }
          }
        ]).toArray();
  
        console.log(OrdersData);
        if (OrdersData.length > 0) {
          resolve(OrdersData);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  
  
  
};
