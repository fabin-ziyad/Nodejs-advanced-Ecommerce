const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = fetchOrderData = (orderNo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderData = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ Order_no: orderNo });
      if (orderData !== undefined || orderData !== null) {
        resolve(orderData);
      } else {
        resolve({ status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};
