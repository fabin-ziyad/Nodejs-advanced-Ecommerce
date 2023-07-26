const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports=GetTotalOrderPrice= (UserId) => {
    return new Promise(async (resolve, reject) => {
      let CartProductsPrice = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(UserId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "CartItems",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              products: { $arrayElemAt: ["$CartItems", 0] },
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              products: 1,
              total: {
                $sum: {
                  $multiply: [
                    "$quantity",
                    { $toInt: "$products.ProductPrice" },
                  ],
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: [
                    "$quantity",
                    { $toInt: "$products.ProductPrice" },
                  ],
                },
              },
            },
          },
        ])
        .toArray();
      let totalprice = parseInt(CartProductsPrice[0]?.total);
      if (!totalprice || totalprice===undefined || totalprice==null) {
        resolve({Status:false})
      } else {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { user: ObjectId(UserId) },
          {
            $set: { total: totalprice },
          }
        )
        .then(() => {
          resolve(CartProductsPrice[0]);
        });
      }
    });
  }