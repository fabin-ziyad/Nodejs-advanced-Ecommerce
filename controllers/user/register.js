const db = require("../../config/connection");
const collection = require("../../config/collection");
const bcrypt=require('bcrypt')
module.exports=NewUser= (ReqData) => {
    return new Promise(async (resolve, reject) => {
      // ReqData.TestingPass = ReqData.register_Password;
      ReqData.register_Password = await bcrypt.hash(
        ReqData.register_Password,
        10
      );
      let UserData = {
        register_Full_Name: ReqData.register_Full_Name,
        register_Mobile_Number: ReqData.resgister_Mobile_Number,
        register_Email: ReqData.register_Email,
        register_Password: ReqData.register_Password,
        display_Name:ReqData.register_Full_Name,
        User_Address: [],
        Cart_Items: [],
        Wishlists: [],
        Order_History: [],
      };
      db.get()
        .collection(collection.USERS_COLLECTION)
        .insertOne(UserData)
        .then((data) => {
          resolve(data);
        });
    });
  }