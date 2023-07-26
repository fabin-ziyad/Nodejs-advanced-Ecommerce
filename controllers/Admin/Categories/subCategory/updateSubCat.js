const ObjectId = require("mongodb").ObjectId;
const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = UpdateSubCat = (UpdateSubCatData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.SUB_CATEGORY_COLLECTION)
      .updateOne(
        { _id: ObjectId(UpdateSubCatData.SUBID) },
        {
          $set: {
            SubCategory: UpdateSubCatData.UpdatedSubCat,
            parentCategory: UpdateSubCatData.parentCategory,
          },
        }
      )
      .then((response) => {
        resolve(response);
      });
  });
};
