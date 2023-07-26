const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const fetchUserData=require('../../common-functions/getUserDetails')
module.exports = getWishlists = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let User = await fetchUserData(UserId);
      if (User.Wishlists.length>0) {
        let WishlistItems = await db
          .get()
          .collection(collection.USERS_COLLECTION)
          .aggregate([
            {
              $match: { _id: ObjectId(UserId) },
            },
            {
              $unwind: "$Wishlists",
            },
            {
              $project: {
                Products: "$Wishlists.Products",
                Wishlist_UniqueId: "$Wishlists.Wishlist_UniqueId",
                InStock: "$Wishlists.InStock",
              },
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "Products",
                foreignField: "_id",
                as: "ProductData",
              },
            },
            {
              $project: {
                Whislist_Products: { $arrayElemAt: ["$ProductData", 0] }, //to remove the array
              },
            },
            {
              $project: {
                _id: 0,
                Product_Id: "$Whislist_Products._id",
                ProductName: "$Whislist_Products.ProductName",
                ProductPrice: "$Whislist_Products.ProductPrice",
                MainCategory: "$Whislist_Products.MainCategory",
                SubCategory: "$Whislist_Products.SubCategory",
                InStock: "$Whislist_Products.InStock",
                WishlistCount:1
              },
            },
          ])
          .toArray();
        WishlistItems.ItemCount = WishlistItems.length;
        resolve(WishlistItems);
      } else {
        console.log("Nothing in wishlist");
        resolve({ Status: false });
      }
    } catch (error) {
        reject(error)
    }
  });
};
