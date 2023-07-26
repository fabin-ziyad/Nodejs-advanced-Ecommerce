const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = MarkShipment = (orderId) => {
  return new Promise((resolve, reject) => {
    try {
      db.get()
        .collection(collection.SHIPMENT)
        .findOne({ Order_Id: ObjectId(orderId) })
        .then((response) => {
          if (response) {
            db.get()
              .collection(collection.SHIPMENT)
              .updateOne(
                { Order_Id: ObjectId(orderId) },
                { $set: { "Shipment.$.confirmed": "Shipped" } }
              )
              .then((response) => {
                if (response) {
                  resolve(response);
                }
              });
          } else {
            db.get()
              .collection(collection.SHIPMENT)
              .insertOne({ Order_Id: ObjectId(orderId), Status: "Pending" })
              .then((response) => {
                if (response) {
                  resolve(response);
                }
              });
          }
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
