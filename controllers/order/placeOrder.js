const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const RemoveFromCartAfterOrder = require("../cart-wishlists/clearCart");
const fecthUserDetails=require('../../common-functions/getUserDetails')
const { v4: uuidv4 } = require("uuid");
const fetchUserCart = require("../../common-functions/fetchUserCart");
module.exports = placeOrder = (UserId, ReqData) => {
  let order_Id;
  return new Promise(async (resolve, reject) => {
    //fetching user data with userId
    const UserData = await fecthUserDetails(UserId);
    // finding the default address
    const address = UserData.User_Address.filter(
      (addr) => addr.Default === true
    );
    // fetching the cart products of this user
    const CartProducts = await fetchUserCart(UserId);

    let OrderId = uuidv4();
    OrderId = OrderId.slice(0, 12);

    // data to insert in cart
    Data_to_insert = {
      Address: address[0],
      Payment: {
        Payment_Method: ReqData.method,
        PaymentId: ReqData.receiptId === null ? "NA" : ReqData.receiptId,
        Amount_to_be_Paid: parseInt(ReqData.TotalAmount),
        PaidAmount: ReqData.method ==="COD" ? "At the time of Delivery": "Pending",
        Amount_due: ReqData.method ==="COD" ? parseInt(ReqData.TotalAmount) : 0,
        status: "Created",
        created_at: new Date(Date.now()),
      },
      User: UserData._id,
      Total_Amount: parseInt(ReqData.TotalAmount),
      Products: CartProducts.products,
      Order_Date: new Date(Date.now()),
      Order_no: OrderId,
      Shipment: "",
    };
    // order Insertion
    if (Data_to_insert) {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .insertOne(Data_to_insert)
        .then(async (response) => {
            if (response.insertedId) {
              await RemoveFromCartAfterOrder(UserData._id);
            order_Id = response.insertedId;
            let shipmentData = {
              Order: response.insertedId,
              TrackingNo: "Na",
              CourierName: "Na",
              ShipmentStatus: "Processing",
              ExpectedDelivery: "Na",
              updatedAt: new Date(Date.now()),
            };
            // Shipment updation
            await db
              .get()
              .collection(collection.SHIPMENT)
              .insertOne(shipmentData)
              .then(async (shipment_response) => {
                if (shipment_response.insertedId) {
                  await db
                    .get()
                    .collection(collection.ORDER_COLLECTION)
                    .updateOne(
                      { _id: ObjectId(response.insertedId) },
                      {
                        $set: {
                          Shipment: ObjectId(shipment_response.insertedId),
                        },
                      }
                    );
                  Data_to_Insert_History = {
                    User: ObjectId(UserId),
                    Date: new Date(Date.now()),
                    Order_Id: response.insertedId,
                    ShipmentId: shipment_response.insertedId,
                    TotalAmount: parseInt(ReqData.TotalAmount),
                  };

                  db.get()
                    .collection(collection.ORDER_HISTORY)
                    .insertOne(Data_to_Insert_History)
                    .then(() => {
                      resolve(order_Id);
                    });
                }
              });
          }
        });
    }
  });
};
