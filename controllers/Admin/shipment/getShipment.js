const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = getShipment = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderShipmentData = await db
        .get()
        .collection(collection.SHIPMENT)
        .findOne({ Order: ObjectId(orderId) });
      if (orderShipmentData !== null || orderShipmentData !== undefined) {
        resolve(orderShipmentData);
      } else {
        resolve(null);
      }
    } catch (error) {
        console.log(error);
        reject(error)
    }
  });
};
