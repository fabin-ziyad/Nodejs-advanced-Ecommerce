const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = fetchUserCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(userId) });
      if ((userCart && userCart !== undefined) || userCart !== null) {
        resolve(userCart);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
