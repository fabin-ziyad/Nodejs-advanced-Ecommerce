const db = require("../../config/connection");
const collection = require("../../config/collection");
const fecthUserDetails = require("../../common-functions/getUserDetails");
const ObjectId = require("mongodb").ObjectId;
module.exports = RemoveFromCart = (UserId, CartnProductData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await fecthUserDetails(UserId);
      if (user.Cart_Items.length <= 1) {
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
                resolve({ Empty: true });
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
                resolve({ Empty: false });
              });
          });
      }
    } catch (error) {
      reject(error)
    }
  });
};
