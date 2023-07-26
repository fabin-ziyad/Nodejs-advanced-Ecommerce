const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = AddSubCategory = (SubCategoryData) => {
  SubCategoryData.Status = JSON.parse("true");
  SubCategoryData.SubCategory = SubCategoryData.SubCategory.toLowerCase();
  return new Promise(async (resolve, reject) => {
    let SubCatExists = await db
      .get()
      .collection(collection.SUB_CATEGORY_COLLECTION)
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [SubCategoryData.parentCategory, "$parentCategory"],
            },
          },
        },
        {
          $match: {
            $expr: { $eq: [SubCategoryData.SubCategory, "$SubCategory"] },
          },
        },
      ])
      .toArray();
      console.log(SubCatExists);
    if (SubCatExists.length == 0) {
      db.get()
        .collection(collection.SUB_CATEGORY_COLLECTION)
        .insertOne(SubCategoryData)
        .then((responseId) => {
          resolve(responseId);
        });
    } else {
      resolve(false);
    }
  });
};
