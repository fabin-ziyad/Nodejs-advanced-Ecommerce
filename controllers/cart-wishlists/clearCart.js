const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const fetchCartCount = require("./fetchCartCount");
module.exports = RemoveFromCartAfterOrder = (UserId) => {
  console.log(UserId);
  return new Promise((resolve, reject) => {
    try {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { user: ObjectId(UserId) },
          { $set: { products: [], total: "" } }
        )
        .then(async () => {
          await db
            .get()
            .collection(collection.USERS_COLLECTION)
            .updateOne({ _id: ObjectId(UserId) }, { $set: { Cart_Items: [] } })
            .then(async (res) => {
              resolve();
            });
        });
    } catch (error) {
      reject(error);
    }
  });
};
