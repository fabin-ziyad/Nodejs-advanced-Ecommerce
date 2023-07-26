const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const fetchUserData = require("../../common-functions/getUserDetails");
module.exports = addtoWishlist = (ReqData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let WishlistProduct = {
        Wishlist_UniqueId: new ObjectId(),
        Products: ObjectId(ReqData.Product),
        InStock: true,
      };
      let User = await fetchUserData(ReqData.User);
      let ProductExists = User.Wishlists.findIndex(
        (ObjIndexes) => ObjIndexes.Products == ReqData.Product
      );
      if (ProductExists >= 0) {
        resolve({ Status: false, message: "Already Exists" });
      } else if ((ProductExists = -1)) {
        db.get()
          .collection(collection.USERS_COLLECTION)
          .updateOne(
            { _id: ObjectId(ReqData.User) },
            {
              $push: { Wishlists: WishlistProduct },
            }
          );
        resolve({ Status: true });
      }
    } catch (err) {
      reject(err)
    }
  });
};
