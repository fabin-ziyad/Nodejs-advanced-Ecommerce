const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = ChangeQuantity = (ReqData) => {
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
};
