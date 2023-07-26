const db = require("../../../config/connection");
const collection = require("../../../config/collection");
module.exports = GetMainCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let MainCategories = await db
        .get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: collection.SUB_CATEGORY_COLLECTION,
              let: { mainId: { $toObjectId: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toObjectId: "$parentCategory" }, "$$mainId"],
                    },
                  },
                },
              ],
              as: "SubCategoryData",
            },
          },

          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              let: { mainCatId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toObjectId: "$MainCategory" }, "$$mainCatId"],
                    },
                  },
                },
                { $count: "Count" },
              ],
              as: "MainCatProducts",
            },
          },
          {
            $project: {
              Status: 1,
              Category_Name: 1,
              SubCatId: "$SubCategoryData._id",
              SubCategoryLength: { $size: "$SubCategoryData" },
              SubCategoryName: "$SubCategoryData.SubCategory",
              MainproductsCount: { $first: "$MainCatProducts.Count" },
            },
          },
        ])
        .toArray();
      resolve(MainCategories);
    } catch (error) {}
  });
};
