const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports=SaveAddress= (UserId, ReqData) => {
    return new Promise(async (resolve, reject) => {
      let Address = {
        Address_UniqueId: new ObjectId(),
        First_Name: ReqData.FirstName,
        Last_Name: ReqData.LastName,
        Company_Name: ReqData.CompanyName,
        Country: ReqData.Country,
        Street_Address: ReqData.StreetAddress,
        Street_Address1: ReqData.StreetAddress1,
        City: ReqData.City,
        State: ReqData.State,
        Zip_Code: ReqData.ZipCode,
        Phone_Number: ReqData.PhoneNumber,
        Email: ReqData.EmailAddress,
        Default: false,
      };
      let User = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: ObjectId(UserId) });
      if (
        !User.User_Address ||
        User.User_Address === undefined ||
        User.User_Address.length == 0
      ) {
        let DefaultAddress = {
          Address_UniqueId: new ObjectId(),
          First_Name: ReqData.FirstName,
          Last_Name: ReqData.LastName,
          Company_Name: ReqData.CompanyName,
          Country: ReqData.Country,
          Street_Address: ReqData.StreetAddress,
          Street_Address1: ReqData.StreetAddress1,
          City: ReqData.City,
          State: ReqData.State,
          Zip_Code: ReqData.ZipCode,
          Phone_Number: ReqData.PhoneNumber,
          Email: ReqData.EmailAddress,
          Default: true,
        };
        db.get()
          .collection(collection.USERS_COLLECTION)
          .updateOne(
            { _id: ObjectId(UserId) },
            {
              $push: { User_Address: DefaultAddress },
            }
          )
          .then(() => {
            resolve({ Status: true });
          });
      } else if (User.User_Address) {
        let default_Addresses = User.User_Address.filter(
          (users) => users.Default == true
        );
        if (default_Addresses) {
          db.get()
            .collection(collection.USERS_COLLECTION)
            .updateOne(
              { _id: ObjectId(UserId) },
              {
                $push: { User_Address: Address },
              }
            )
            .then(() => {
              resolve({ Status: true });
            });
        }
      }
    });
  }