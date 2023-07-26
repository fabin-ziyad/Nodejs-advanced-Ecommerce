const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = DeleteProduct = (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .deleteOne({ _id: ObjectId(ReqData.ProductId) })
      .then((response) => {
        resolve(ReqData.ProductId);
      });
  });
};
