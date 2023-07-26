const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const fetchUserCart = require("../../common-functions/fetchUserCart");
module.exports = getCartProducts = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Check cart exists under this user
      let CartExists = await fetchUserCart(UserId);
      //return false if no cart exists
      if (!CartExists || CartExists === undefined || CartExists === null) {
        resolve({ Status: false });
      } else {
        //Fetching details,price according to qty of products inside products array if cart exists
        let CartProducts = await db
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
                UniqueId: "$products.UniqueId",
                item: "$products.item",
                quantity: "$products.quantity",
                color: "$products.color",
                size: "$products.Size",
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
                UniqueId: 1,
                item: 1,
                quantity: 1,
                color: 1,
                size: 1,
                products: { $arrayElemAt: ["$CartItems", 0] },
              },
            },
            {
              $project: {
                UniqueId: 1,
                item: 1,
                quantity: 1,
                color: 1,
                size: 1,
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
          ])
          .toArray();
        resolve(CartProducts);
      }
    } catch (error) {
      reject(error)
    }
  });
};
