const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = UpdateAddress = (UserId, ReqData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.USERS_COLLECTION)
      .updateOne(
        {
          _id: ObjectId(UserId),
          "User_Address.Address_UniqueId": ObjectId(ReqData.AddressId),
        },
        {
          $set: {
            "User_Address.$.First_Name": ReqData.FirstName,
            "User_Address.$.Last_Name": ReqData.LastName,
            "User_Address.$.Company_Name": ReqData.companyName,
            "User_Address.$.Email": ReqData.Email,
            "User_Address.$.Street_Address": ReqData.Street_Address,
            "User_Address.$.Street_Address1": ReqData.Street_Address1,
            "User_Address.$.City": ReqData.City,
            "User_Address.$.State": ReqData.State,
            "User_Address.$.Country": ReqData.Country,
            "User_Address.$.Zip_Code": ReqData.Zip_Code,
            "User_Address.$.Phone_Number": ReqData.Phone_Number,
          },
        }
      )
      .then(() => {
        resolve({ Status: true });
      });
  });
};
