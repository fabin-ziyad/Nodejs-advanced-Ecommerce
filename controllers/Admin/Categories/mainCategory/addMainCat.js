const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = AddMainCategory = (MainCategoryData) => {
  MainCategoryData.Status = JSON.parse("true");
  return new Promise(async (resolve, reject) => {
    MainCategoryData.Category_Name =
      MainCategoryData.Category_Name.toUpperCase();
    let MaiCatExists = await db
      .get()
      .collection(collection.MAIN_CATEGORY_COLLECTION)
      .findOne({ Category_Name: MainCategoryData.Category_Name });
    if (!MaiCatExists) {
      db.get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .insertOne(MainCategoryData)
        .then((ResultId) => {
          resolve(ResultId.insertedId.toString());
        });
    } else {
      resolve(false);
    }
  });
};
