const db = require("../../../config/connection");
const collection = require("../../../config/collection");
module.exports = GetAdmin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .find()
        .toArray();
      resolve(Admin[0]);
    } catch (error) {
      reject(error)
    }
  });
};
