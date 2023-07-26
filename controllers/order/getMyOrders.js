const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = getMyOrders = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let OrdersData = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { User: ObjectId(userId) },
          },
          {
            $unwind: "$Products",
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "Products.item",
              foreignField: "_id",
              as: "productData",
            },
          },
          {
            $unwind: "$productData",
          },
          {
            $lookup: {
              from: collection.SHIPMENT,
              localField: "_id",
              foreignField: "Order",
              as: "shipmentData",
            },
          },
          {
            $group: {
              _id: {
                _id: "$_id",
                Address: "$Address",
                Payment: "$Payment",
                Total_Amount: "$Total_Amount",
                Order_Date: "$Order_Date",
                Status: "$Status",
                Order_no: "$Order_no",
                shipment: {
                  ShipmentStatus: {
                    $arrayElemAt: ["$shipmentData.ShipmentStatus", 0],
                  },
                  ExpectedDelivery: {
                    $arrayElemAt: ["$shipmentData.ExpectedDelivery", 0],
                  },
                  TrackingNo: { $arrayElemAt: ["$shipmentData.TrackingNo", 0] },
                  CourierName: {
                    $arrayElemAt: ["$shipmentData.CourierName", 0],
                  },
                },
              },
              products: {
                $push: {
                  _id: "$productData._id",
                  ProductName: "$productData.ProductName",
                  Colors: "$productData.Colors",
                  Gender: "$productData.Gender",
                  ProductSize: "$productData.ProductSize",
                  ProductPrice: "$productData.ProductPrice",
                  ProductQuantity: "$productData.ProductQuantity",
                  InStock: "$productData.InStock",
                  orderedQuantity: "$Products.quantity",
                },
              },
              productsCount: { $sum: 1 }, // Count the number of products in each order
            },
          },
          {
            $project: {
              _id: "$_id._id",
              Address: "$_id.Address",
              Payment: "$_id.Payment",
              Total_Amount: "$_id.Total_Amount",
              Order_Date: "$_id.Order_Date",
              Status: "$_id.Status",
              Order_no: "$_id.Order_no",
              products: 1,
              productsCount: 1,
              shipment: "$_id.shipment",
            },
          },
        ])
        .toArray();

      console.log(OrdersData);
      if (OrdersData.length > 0) {
        resolve(OrdersData);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
};
