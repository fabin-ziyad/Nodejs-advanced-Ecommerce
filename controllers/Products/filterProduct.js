const db = require("../../config/connection");
const collection = require("../../config/collection");

module.exports=  filterProductsByMainCat= (ID) => {
    return new Promise(async(resolve, reject) => {
      let Products = await db.get().collection(collection.PRODUCT_COLLECTION).find({ MainCategory:ID }).toArray()
      resolve(Products)
    })
  }