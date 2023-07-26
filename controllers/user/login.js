const db = require("../../config/connection");
const collection = require("../../config/collection");
const bcrypt = require("bcrypt");

module.exports = LoginUser = (ReqData) => {
  return new Promise(async (resolve, reject) => {
    let User_Details = {};
    let User = await db
      .get()
      .collection(collection.USERS_COLLECTION)
      .findOne({ register_Email: ReqData.Login_email });
    if (User) {
      bcrypt
        .compare(ReqData.Login_Password, User.register_Password)
        .then((Response) => {
          if (Response) {
            let UserData = {
              register_Full_Name: User.register_Full_Name,
              _id: User._id,
              register_Email: User.register_Email,
            };
            User_Details.User = UserData;
            User_Details.status = true;
            resolve(User_Details);
          } else {
            resolve({ status: false });
          }
        });
    } else {
      console.log("login failed");
      resolve({ status: false });
    }
  });
};
