const db = require("../../config/connection");
const collection = require("../../config/collection");
const fetchOrderData = require("../../common-functions/fetchOrderData");
const ObjectId = require("mongodb").ObjectId;
fetchOrderData
module.exports = cancelOrder = (orderNo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Order = await fetchOrderData(orderNo);
      if (Order !== null || Order !== undefined) {
        let updateShipment = await db
          .get()
          .collection(collection.SHIPMENT)
          .updateOne(
            {
              Order: ObjectId(Order._id),
            },
            {
              $set: {
                ShipmentStatus: "Cancelled",
                updatedAt: new Date(Date.now()),
              },
            }
          );
        if (updateShipment) {
          resolve({ status: true });
        }
      }
    } catch (err) {
      reject(err)
    }
  });
};
