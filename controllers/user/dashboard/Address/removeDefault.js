const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = RemoveDefault = (UserId, ReqData) => {
  return new Promise(async (resolve, reject) => {
    let UserAddress = await db
      .get()
      .collection(collection.USERS_COLLECTION)
      .findOne(
        { _id: ObjectId(UserId) },
        { User_Address: { $elemMatch: { Default: true } } }
      );
    db.get()
      .collection(collection.USERS_COLLECTION)
      .updateOne(
        {
          _id: ObjectId(UserId),
          "User_Address.Address_UniqueId": ObjectId(ReqData),
        },
        {
          $set: { "User_Address.$.Default": false },
        }
      )
      .then(() => {
        resolve({ Status: true });
      });
  });
};
