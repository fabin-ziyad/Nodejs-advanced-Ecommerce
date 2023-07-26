const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = updateShipment = (Data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Order = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ Order_no: Data.orderNo });
      if (Order !== null || Order !== undefined) {
        let shipmentData = {
          Order: Order._id,
          TrackingNo: Data.tracking_no,
          CourierName: Data.courier_name,
          ShipmentStatus: Data.courier_status,
          ExpectedDelivery: Data.expected_delivery,
        };
        if (shipmentData.ShipmentStatus === "Delivered") {
          await db
            .get()
            .collection(collection.ORDER_COLLECTION)
            .updateOne(
              { Order_no: Data.orderNo },
              {
                $set: {
                  "Payment.PaidAmount": Order.Total_Amount,
                  "Payment.Amount_due": 0,
                },
              }
            );
        }
        let Shipment = await db
          .get()
          .collection(collection.SHIPMENT)
          .findOne({ Order: ObjectId(Order._id) });

        if (Shipment) {
          await db
            .get()
            .collection(collection.SHIPMENT)
            .updateOne(
              { Order: ObjectId(Order._id) },
              {
                $set: {
                  TrackingNo: Data.tracking_no,
                  CourierName: Data.courier_name,
                  ShipmentStatus: Data.courier_status,
                  ExpectedDelivery: Data.expected_delivery,
                  updatedAt: new Date(Date.now()),
                },
              }
            )
            .then(async (response) => {
              if (response) {
                if (Order.hasOwnProperty(Shipment) == false) {
                  await db
                    .get()
                    .collection(collection.ORDER_COLLECTION)
                    .updateOne(
                      { Order_no: Data.orderNo },
                      { $set: { Shipment: Shipment._id } }
                    );
                }
                resolve({
                  status: true,
                  OrderStatus: shipmentData.ShipmentStatus,
                });
              }
            });
        } else {
          await db
            .get()
            .collection(collection.SHIPMENT)
            .insertOne(shipmentData)
            .then(async (response) => {
              if (response.acknowledged) {
                await db
                  .get()
                  .collection(collection.ORDER_COLLECTION)
                  .updateOne(
                    { Order_no: Data.orderNo },
                    { $set: { Shipment: response?.insertedId } }
                  );
                resolve({
                  status: true,
                  OrderStatus: shipmentData.ShipmentStatus,
                });
              } else {
                resolve({ status: false });
              }
            });
        }
      } else {
        resolve({ status: false });
      }
    } catch (error) {
        console.log(error);
        reject(error)
    }
  });
};
