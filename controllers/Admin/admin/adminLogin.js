const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const bcrypt = require("bcrypt");
module.exports = adminLogin = (credentials) => {
  return new Promise(async (resolve, reject) => {
    try {
      let responses = {};
      let AdminData = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ AdminName: credentials.AdminName });
      if (AdminData) {
        bcrypt
          .compare(credentials.AdminPass, AdminData.AdminPass)
          .then((DataResponse) => {
            if (DataResponse) {
              console.log("Admin Logged in");
              responses.AdminData = AdminData;
              responses.DataResponse = true;
              resolve(responses);
            } else {
              console.log("error in credentials");
              resolve({ DataResponse: false });
            }
          });
      }
    } catch (error) {
        reject(error)
    }
  });
};
