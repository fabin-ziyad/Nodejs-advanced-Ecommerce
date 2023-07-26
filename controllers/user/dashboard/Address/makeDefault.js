const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = MakeDefault = (UserId, ReqData) => {
  return new Promise(async (resolve, reject) => {
    let User = await db
      .get()
      .collection(collection.USERS_COLLECTION)
      .findOne({ _id: ObjectId(UserId) });

    let defult_Addresses = User.User_Address.filter(
      (users) => users.Default == true
    );
    if (defult_Addresses) {
      if (defult_Addresses.length <= 1) {
        let ExistingAddressId = defult_Addresses[0].Address_UniqueId;
        db.get()
          .collection(collection.USERS_COLLECTION)
          .updateOne(
            {
              _id: ObjectId(UserId),
              "User_Address.Address_UniqueId": ObjectId(ExistingAddressId),
            },
            {
              $set: { "User_Address.$.Default": false },
            }
          )
          .then(async () => {
            await db
              .get()
              .collection(collection.USERS_COLLECTION)
              .updateOne(
                {
                  _id: ObjectId(UserId),
                  "User_Address.Address_UniqueId": ObjectId(ReqData),
                },
                {
                  $set: { "User_Address.$.Default": true },
                }
              )
              .then(() => {
                resolve({ Status: true });
              });
          });
      }
    } else {
      console.log("maxlimit");
      resolve({ MaxLimit: true });
    }
  });
};
