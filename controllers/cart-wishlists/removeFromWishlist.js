const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = RemoveFromWishlist = (ReqData) => {
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
};
