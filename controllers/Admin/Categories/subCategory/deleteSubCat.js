const ObjectId = require("mongodb").ObjectId;
const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports= DeleteSubCat= (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.SUB_CATEGORY_COLLECTION).deleteOne({ _id: ObjectId(ReqData.SubCatId) }).then(() => {
        db.get().collection(collection.PRODUCT_COLLECTION).deleteMany({ SubCategory: ReqData.SubCatId }).then(() =>{
          resolve()
        })
      })
    })
  }