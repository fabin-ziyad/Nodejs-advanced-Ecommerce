const ObjectId = require("mongodb").ObjectId;
const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = DisableMainCat = (MainCatId) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.MAIN_CATEGORY_COLLECTION)
      .updateOne(
        { _id: ObjectId(MainCatId) },
        {
          $set: {
            Status: false,
          },
        }
      )
      .then(() => {
        db.get()
          .collection(collection.SUB_CATEGORY_COLLECTION)
          .updateMany(
            { parentCategory: MainCatId },
            {
              $set: {
                Status: false,
              },
            }
          )
          .then(() => {
            db.get()
              .collection(collection.PRODUCT_COLLECTION)
              .updateMany(
                { MainCategory: MainCatId },
                {
                  $set: { Status: false },
                }
              );
          });
      });
    resolve();
  });
};
