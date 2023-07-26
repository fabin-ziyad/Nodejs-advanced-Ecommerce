const db = require("../../../config/connection");
const collection = require("../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = UpdateProduct = (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(ReqData.UpdateProductId) },
        {
          $set: {
            ProductName: ReqData.ProductName,
            ProductPrice: ReqData.ProductPrice,
            ProductQuantity: ReqData.ProductQuantity,
            FullDescription: ReqData.FullDescription,
            ShortDescription: ReqData.ShortDescription,
            BrandName: ReqData.BrandName,
            Colors: ReqData.Colors,
            ProductSize: ReqData.ProductSize,
            MRP: ReqData.MRP,
          },
        }
      )
      .then((response) => {
        resolve(ReqData.UpdateProductId);
      });
  });
};
