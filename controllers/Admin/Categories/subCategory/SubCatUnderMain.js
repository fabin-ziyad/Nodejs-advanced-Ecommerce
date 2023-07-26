const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = subCatUnderMainCat = (parentId) => {
  return new Promise(async (resolve, reject) => {
    const SubCat = await db
      .get()
      .collection(collection.SUB_CATEGORY_COLLECTION)
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [parentId, "$parentCategory"],
            },
          },
        },
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
            _id: 1,
            Status: 1,
            SubCategory: 1,
            // parentCategory: 1,
            subCatProductCount: { $first: "$Products.Count" },
            MainCategoryName: {
              $first: "$MainCategoryData.Category_Name",
            },
          },
        },
      ])
      .toArray();

    resolve(SubCat);
  });
};
