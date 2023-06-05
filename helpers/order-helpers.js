var db = require("../config/connection");
var collection = require("../config/collection");
var objectId = require("mongodb").ObjectId;
var bcrypt = require("bcrypt");
const DateConvert=require("../middleware/dateConvert")
const { v4: uuidv4 } = require("uuid");
module.exports = {
  COD_order_Success: (UserId, ReqData) => {
    return new Promise(async (resolve, reject) => {
      const UserData = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: objectId(UserId) });
      const address = UserData.User_Address.filter(
        (addr) => addr.Default === true
      );
      const CartProducts = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(UserId) });

      let OrderId = uuidv4();
      OrderId = OrderId.slice(0, 12);
      Data_to_insert = {
        Address: address[0],
        Payment_Method: ReqData.method,
        User: UserData._id,
        Total_Amount: parseInt(ReqData.TotalAmount),
        Products: CartProducts.products,
        Order_Date: new Date(Date.now()),
        Status: ReqData.method === "COD" ? "Placed" : "Pending",
        Order_no: OrderId,
        Shipment: ""
      };
      if (Data_to_insert) {
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .insertOne(Data_to_insert)
          .then(async (response) => {
            if (await response.insertedId) {
              let shipmentData = {
                Order: response.insertedId,
                TrackingNo: "Na",
                CourierName: "Na",
                ShipmentStatus: "Processing",
                ExpectedDelivery: "Na",
                updatedAt:new Date(Date.now())
              };
              await db.get().collection(collection.SHIPMENT).insertOne(shipmentData).then(async(shipment_response)=>{
                if(shipment_response.insertedId){
                  await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(response.insertedId)},{$set:{"Shipment":objectId(shipment_response.insertedId)}})
                  Data_to_Insert_History = {
                    User: objectId(UserId),
                    Date: new Date(Date.now()),
                    Order_Id: response.insertedId,
                    ShipmentId:shipment_response.insertedId,
                    TotalAmount: parseInt(ReqData.TotalAmount),
                  };
    
                  db.get()
                    .collection(collection.ORDER_HISTORY)
                    .insertOne(Data_to_Insert_History)
                    .then((response) => {
                      if (response) {
                        response.Placed = true;
                        resolve(response);
                      }
                    });
                }
              })
            }
          });
      }
    });
  },
  RemoveFromCartAfterOrder: (UserId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { user: objectId(UserId) },
          { $set: { products: [], total: "" } }
        )
        .then(async () => {
          await db
            .get()
            .collection(collection.USERS_COLLECTION)
            .updateOne({ _id: objectId(UserId) }, { $set: { Cart_Items: [] } })
            .then((res) => {});
        })
        .then(() => {
          resolve();
        });
    });
  },
  GetAllOrders: () => {
    return new Promise(async (resolve, reject) => {
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
          // {
          //   $lookup: {
          //     from: collection.PRODUCT_COLLECTION,
          //     localField: "Products.item",
          //     foreignField: "_id",
          //     as: "ProductDetails",
          //   },
          // },
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
              Payment_Method: 1,
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
        ])
        .toArray();
        OrdersData.Order_Date=DateConvert.convertDate(OrdersData.Order_Date)
      resolve(OrdersData);
    });
  },
  getOrderDetailsByQuery: (orderNo) => {
    return new Promise(async (resolve, reject) => {
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
        console.log("orderProducts",orderProducts);
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
    });
  },
  MarkShipment: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.SHIPMENT)
        .findOne({ Order_Id: objectId(orderId) })
        .then((response) => {
          if (response) {
            db.get()
              .collection(collection.SHIPMENT)
              .updateOne(
                { Order_Id: objectId(orderId) },
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
              .insertOne({ Order_Id: objectId(orderId), Status: "Pending" })
              .then((response) => {
                if (response) {
                  resolve(response);
                }
              });
          }
        });
    });
  },
  //   Shipment
  updateShipment: (Data) => {
    return new Promise(async (resolve, reject) => {
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
        let Shipment = await db
          .get()
          .collection(collection.SHIPMENT)
          .findOne({ Order: objectId(Order._id) });

        if (Shipment) {
          await db
            .get()
            .collection(collection.SHIPMENT)
            .updateOne(
              { Order: objectId(Order._id) },
              {
                $set: {
                  TrackingNo: Data.tracking_no,
                  CourierName: Data.courier_name,
                  ShipmentStatus: Data.courier_status,
                  ExpectedDelivery: Data.expected_delivery,
                  updatedAt:new Date(Date.now())
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
                reject({ status: false });
              }
            });
        }
      } else {
        reject({ status: false });
      }
    });
  },
  getShipment: (orderId) => {
    return new Promise(async (resolve, reject) => {
      orderShipmentData = await db
        .get()
        .collection(collection.SHIPMENT)
        .findOne({ Order: objectId(orderId) });
      if (orderShipmentData !== null || orderShipmentData !== undefined) {
        resolve(orderShipmentData);
      } else {
        reject(null);
      }
    });
  },
  //   end Shipment
};
