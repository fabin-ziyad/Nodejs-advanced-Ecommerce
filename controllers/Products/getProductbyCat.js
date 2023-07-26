const db = require("../../config/connection");
const collection = require("../../config/collection");
module.exports = getProductsByCategory = (subCatId) => {
  return new Promise(async (resolve, reject) => {
    const Products = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find({ SubCategory: subCatId, Status: true })
      .toArray();
    const SubCat = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [subCatId, "$SubCategory"],
            },
          },
        },
        {
          $lookup: {
            from: collection.SUB_CATEGORY_COLLECTION,
            let: { subCatId: { $toObjectId: "$SubCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$subCatId"] } },
              },
            ],
            as: "SubCategoryData",
          },
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            let: { mainCatId: { $toObjectId: "$MainCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$mainCatId"] } },
              },
            ],
            as: "MainCategoryData",
          },
        },
        {
          $project: {
            _id: 1,
            Status: 1,
            SubCategoryName: {
              $first: "$SubCategoryData.SubCategory",
            },
            mainCategoryName: {
              $first: "$MainCategoryData.Category_Name",
            },
          },
        },
      ])
      .toArray();

    Data_to_pass = {
      Products,
      SubCategoryName: SubCat[0]?.SubCategoryName,
      MainCategoryName: SubCat[0]?.mainCategoryName,
    };
    resolve(Data_to_pass);
  });
};
