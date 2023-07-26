const ObjectId = require("mongodb").ObjectId;
const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = EnableSubCat = (SubCatId) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.SUB_CATEGORY_COLLECTION)
      .updateOne(
        { _id: ObjectId(SubCatId) },
        {
          $set: {
            Status: true,
          },
        }
      )
      .then(() => {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateMany(
            { SubCategory: SubCatId },
            {
              $set: {
                Status: true,
              },
            }
          );
      })
      .then(() => {
        resolve();
      });
  });
};
