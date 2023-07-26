const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports = AllInactiveCount = () => {
  let Inactives = JSON.parse("false");
  return new Promise(async (resolve, reject) => {
    let Counts = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .aggregate([
        {
          $match: { $expr: { $eq: ["$Status", Inactives] } },
        },
        {
          $count: "InactiveCounts",
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            pipeline: [
              {
                $match: { $expr: { $eq: ["$Status", Inactives] } },
              },
              {
                $count: "InactiveMainCats",
              },
            ],
            as: "InactiveMainCatsCount",
          },
        },
        {
          $lookup: {
            from: collection.SUB_CATEGORY_COLLECTION,
            pipeline: [
              {
                $match: { $expr: { $eq: ["$Status", Inactives] } },
              },
              {
                $count: "InactiveSubCats",
              },
            ],
            as: "InactiveSubCatsCount",
          },
        },

        {
          $project: {
            InactiveProducts: "$InactiveCounts",
            InactiveMainCats: {
              $first: "$InactiveMainCatsCount.InactiveMainCats",
            },
            InactiveSubCats: {
              $first: "$InactiveSubCatsCount.InactiveSubCats",
            },
          },
        },
      ]);
    resolve(Counts[0]);
  });
};
