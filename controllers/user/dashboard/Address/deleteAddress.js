const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports=DeleteAddress= (UserId, ReqData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          { _id: ObjectId(UserId) },
          {
            $pull: {
              User_Address: { Address_UniqueId: ObjectId(ReqData.AddressId) },
            },
          }
        )
        .then(async () => {
          let Addresses = await db
            .get()
            .collection(collection.USERS_COLLECTION)
            .findOne({ _id: ObjectId(UserId) });
          if (!Addresses.User_Address.length == 0) {
            let firstUser_Address = Addresses.User_Address[0].Address_UniqueId;
            db.get()
              .collection(collection.USERS_COLLECTION)
              .updateOne(
                {
                  "User_Address.Address_UniqueId": ObjectId(firstUser_Address),
                },
                {
                  $set: { "User_Address.$.Default": true },
                }
              )
              .then(() => {
                resolve({ Status: true });
              });
          } else {
            resolve({ Status: false });
          }
        });
    });
  }