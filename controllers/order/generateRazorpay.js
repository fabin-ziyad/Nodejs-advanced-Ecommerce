const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const fetchUserDetails=require('../../common-functions/getUserDetails')
var instance = new Razorpay({
  key_id: "rzp_test_Ta5B0oO7u00fCU",
  key_secret: "HYmL8BI22fT6VMIkXUe4Y3dh",
});
module.exports = generateRazorpay = (userId, orderId, TotalAmount) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await fetchUserDetails(userId);
      var options = {
        amount: TotalAmount * 100,
        currency: "INR",
        receipt: orderId.toString(),
      };
      instance.orders.create(options, (err, order) => {
        if (order && order !== undefined) {
          (order.customerName = userData.register_Full_Name),
            (order.customerMail = userData.register_Email),
            (order.customerPhone = userData.resgister_Mobile_Number);
          resolve(order);
        } else {
          if (err) console.log(err);
          resolve({ paymentSuccess: false });
        }
      });
    } catch (error) {
        reject(error)
    }
  });
};
