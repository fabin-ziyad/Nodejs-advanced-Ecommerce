const ObjectId = require("mongodb").ObjectId;
const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = DeleteMainCat = (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.MAIN_CATEGORY_COLLECTION)
      .deleteOne({ _id: ObjectId(ReqData.MainCatId) })
      .then(() => {
        db.get()
          .collection(collection.SUB_CATEGORY_COLLECTION)
          .deleteMany({ parentCategory: ReqData.MainCatId })
          .then(() => {
            db.get()
              .collection(collection.PRODUCT_COLLECTION)
              .deleteMany({ MainCategory: ReqData.MainCatId });
          });
      });
    resolve();
  });
};
