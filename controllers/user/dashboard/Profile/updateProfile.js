const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = UpdateUser = (UserId, ReqData) => {
  return new Promise(async (resolve, reject) => {
    let User = await db
      .get()
      .collection(collection.USERS_COLLECTION)
      .findOne({ _id: ObjectId(UserId) });
    if (User) {
      bcrypt
        .compare(ReqData.CurrentPass, User.register_Password)
        .then((Response) => {
          if (Response) {
            db.get()
              .collection(collection.USERS_COLLECTION)
              .updateOne(
                { _id: ObjectId(UserId) },
                {
                  $set: {
                    register_Full_Name: ReqData.Fullname,
                    register_Email: ReqData.email,
                    display_Name: ReqData.Displayname,
                  },
                }
              )
              .then(() => {
                console.log("updated");
                resolve({ Status: true });
              });
          } else {
            console.log("password error");
            resolve({ Status: false });
          }
        });
    } else {
      console.log("user Not found");
      resolve({ Status: false });
    }
  });
};
