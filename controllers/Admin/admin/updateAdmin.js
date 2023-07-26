const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = UpdateAdminProfle = async (ReqData) => {
  return new Promise(async (resolve, reject) => {
    try {
      ReqData.AdminNewPass = await bcrypt.hash(ReqData.AdminNewPass, 10);
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .updateOne(
          { _id: ObjectId(ReqData.MatchId) },
          {
            $set: {
              AdminName: ReqData.AdminUserName,
              AdminEmail: ReqData.AdminEmail,
              AdminFirstName: ReqData.AdminFirstName,
              AdminLastName: ReqData.AdminLastName,
              AdminPass: ReqData.AdminNewPass,
            },
          }
        )
        .then(() => {
          resolve();
        });
    } catch (error) {
        console.log(error);
        reject(error)
    }
  });
};
