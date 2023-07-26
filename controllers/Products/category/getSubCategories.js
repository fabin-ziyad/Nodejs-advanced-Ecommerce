const db = require("../../../config/connection");
const collection = require("../../../config/collection");
module.exports = AllSubCategory = () => {
  return new Promise(async (resolve, reject) => {
    FullSubCategory = await db
      .get()
      .collection(collection.SUB_CATEGORY_COLLECTION)
      .aggregate([
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            let: { parentid: { $toObjectId: "$parentCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$parentid"] } },
              },
            ],
            as: "MainCategoryData",
          },
        },
        {
          $lookup: {
            from: collection.PRODUCT_COLLECTION,
            let: { subCatId: { $toObjectId: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: "$SubCategory" }, "$$subCatId"],
                  },
                },
              },
              { $count: "Count" },
            ],
            as: "Products",
          },
        },
        {
          $project: {
            SubCatId: "$_id",
            Status: 1,
            MainCategoryName: {
              $first: "$MainCategoryData.Category_Name",
            },
            SubCategory: 1,
            parentCategory: 1,
            subCatProductCount: { $first: "$Products.Count" },
          },
        },
      ])
      .toArray();
    resolve(FullSubCategory);
  });
};
