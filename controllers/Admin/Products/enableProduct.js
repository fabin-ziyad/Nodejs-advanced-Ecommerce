const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = EnableProduct = (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(ReqData) },
        {
          $set: {
            Status: true,
          },
        }
      )
      .then(() => {
        resolve();
      });
  });
};
