const db = require("../config/connection");
const collection = require("../config/collection");
module.exports = GetAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let AllUser = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .find({})
        .toArray();
      resolve(AllUser);
    } catch (error) {
        console.log(error);
        reject(error)
    }
  });
};
