const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = GetProductDetails = (ProductId) => {
  return new Promise(async (resolve, reject) => {
    let GetProduct = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .aggregate([
        {
          $match: { _id: ObjectId(ProductId) },
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            let: { parentId: { $toObjectId: "$MainCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$parentId"] } },
              },
            ],
            as: "MainCategoryData",
          },
        },
        {
          $lookup: {
            from: collection.SUB_CATEGORY_COLLECTION,
            let: { subCategoryId: { $toObjectId: "$SubCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$subCategoryId"] } },
              },
            ],
            as: "SubacategoryData",
          },
        },

        {
          $project: {
            _id: 1,
            ProductName: 1,
            MainCategory: {
              $arrayElemAt: ["$MainCategoryData.Category_Name", 0],
            },
            SubCategory: {
              $arrayElemAt: ["$SubacategoryData.SubCategory", 0],
            },
            MainCategoryId: "$MainCategory",
            SubCategoryId: "$SubCategory",
            ProductPrice: 1,
            ProductQuantity: 1,
            ShortDescription: 1,
            FullDescription: 1,
            ProductTags: 1,
            ProductSize: 1,
            BrandName: 1,
            Colors: 1,
            Status: 1,
            Gender: 1,
            New_Arrival: 1,
            Featured: 1,
            Top_Rated: 1,
            MRP: 1,
          },
        },
      ])
      .toArray();
    resolve(GetProduct[0]);
  });
};
