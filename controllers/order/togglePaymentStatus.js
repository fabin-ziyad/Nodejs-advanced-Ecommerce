const RemoveFromCartAfterOrder = require("../cart-wishlists/clearCart");
const db = require("../../config/connection");
const collection = require("../../config/collection");
const objectId = require("mongodb").ObjectId;
module.exports = changePaymentStatus = (orderId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId["order[receipt]"]) },
          {
            $set: {
              "Payment.Payment_Method": "Online",
              "Payment.PaymentId": orderId["response[razorpay_payment_id]"],
              "Payment.PaidAmount": parseInt(orderId["order[amount]"]) * 100,
              "Payment.status": orderId["order[status]"],
              "Payment.created_at": new Date(Date.now()),
            },
          }
        );
      await RemoveFromCartAfterOrder(userId);
      resolve({ status: true });
    } catch (error) {
      reject(error);
    }
  });
};
