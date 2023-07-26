const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = fetchUserData = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: ObjectId(userId) });
      if ((userData && userData !== undefined) || userData !== null) {
        resolve(userData);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
