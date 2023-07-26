const crypto = require("crypto");
module.exports = verifyPayment = (details) => {
  console.log(details);
  return new Promise((resolve, reject) => {
    let hmac = crypto.createHmac("sha256", "HYmL8BI22fT6VMIkXUe4Y3dh");
    hmac.update(
      details["response[razorpay_order_id]"] +
        "|" +
        details["response[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");
    if (hmac === details["response[razorpay_signature]"]) {
      resolve({ status: true });
    } else {
      reject({ status: false });
    }
  });
};
