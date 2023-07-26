const ObjectId = require("mongodb").ObjectId;
const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = UpdateMainCategory = (UpdateData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.MAIN_CATEGORY_COLLECTION)
      .updateOne(
        { _id: ObjectId(UpdateData.ID) },
        {
          $set: { Category_Name: UpdateData.UpdatedMainCat },
        }
      )
      .then(() => {
        resolve();
      });
  });
};
