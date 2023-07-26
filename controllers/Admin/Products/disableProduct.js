const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = DisableProduct = (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(ReqData) },
        {
          $set: {
            Status: false,
          },
        }
      )
      .then(() => {
        resolve();
      });
  });
};
