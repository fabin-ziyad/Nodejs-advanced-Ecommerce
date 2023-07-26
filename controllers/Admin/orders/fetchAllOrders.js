const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const convertDate=require("../../../middleware/dateConvert")
module.exports = GetAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let OrdersData = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: collection.USERS_COLLECTION,
              localField: "User",
              foreignField: "_id",
              as: "User",
            },
          },
          {
            $unwind: "$User",
          },
          {
            $lookup: {
              from: collection.SHIPMENT,
              localField: "Shipment",
              foreignField: "_id",
              as: "ShipmentData",
            },
          },
          {
            $project: {
              _id: 1,
              Address: 1,
              Payment: 1,
              User: {
                _id: 1,
                register_Full_Name: 1,
                register_Email: 1,
                resgister_Mobile_Number: 1,
              },
              ShipmentSatus: "$ShipmentData.ShipmentStatus",
              Total_Amount: 1,
              Products_Count: { $size: "$Products" },
              Order_Date: 1,
              Status: 1,
              Order_no: 1,
            },
          },
          { $sort: { Order_Date: -1 } },
        ])
        .toArray();
      OrdersData.Order_Date = await convertDate.convertDate(
        OrdersData.Order_Date
      );
      resolve(OrdersData);
    } catch (error) {
        console.log(error);
        reject(error)
    }
  });
};
