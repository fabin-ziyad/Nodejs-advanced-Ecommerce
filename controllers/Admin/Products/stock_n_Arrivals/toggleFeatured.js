const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = ToggleFeatured = (ProductId, featured) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(ProductId) },
        {
          $set: {
            Featured: featured,
          },
        }
      )
      .then(() => {
        resolve();
      });
  });
};
