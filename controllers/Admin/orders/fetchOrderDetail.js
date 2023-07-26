const db = require("../../../config/connection");
const collection = require("../../../config/collection");
module.exports = getOrderDetailsByQuery = (orderNo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderProducts = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { Order_no: orderNo },
          },
          {
            $unwind: "$Products",
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "Products.item",
              foreignField: "_id",
              as: "Product",
            },
          },
          {
            $unwind: "$Product",
          },
          {
            $project: {
              products: "$Product",
              quantity: "$Products.quantity",
              color: "$Products.color",
              size: "$Products.Size",
              productPrice: { $toInt: "$Product.ProductPrice" },
            },
          },

          {
            $project: {
              products: 1,
              quantity: 1,
              color: 1,
              size: 1,
              total: {
                $sum: {
                  $multiply: ["$quantity", "$productPrice"],
                },
              },
            },
          },
        ])
        .toArray();
      await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ Order_no: orderNo })
        .then((Order) => {
          Data_to_Pass = {
            orderProducts,
            Order,
          };
          resolve(Data_to_Pass);
        });
    } catch (error) {
        console.log(error);
        reject(error)
    }
  });
};
