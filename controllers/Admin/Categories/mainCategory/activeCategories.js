const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");

module.exports = GetInactiveMainCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let InactiveMainCategories = await db
        .get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .aggregate([
          // Add a $match stage to filter by status = false
          {
            $match: {
              Status: false,
            },
          },
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
      resolve(InactiveMainCategories);
    } catch (error) {
      reject(error);
    }
  });
};
