const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = ToggleFeatured = (ProductId, newArrival) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(ProductId) },
        {
          $set: {
            New_Arrival: newArrival,
          },
        }
      )
      .then(() => {
        resolve();
      });
  });
};
