const db = require("../../../config/connection");
const collection = require("../../../config/collection");
module.exports = addproducts = (products) => {
  return new Promise((resolve, reject) => {
    let ProductData = {
      ...products,
      Status: JSON.parse("true"),
      ProductPrice: parseInt(products.ProductPrice),
      MRP: parseInt(products.MRP),
      ProductQuantity: parseInt(products.ProductQuantity),
      New_Arrival: false,
      Colors: products.Colors,
      ProductSize: products.ProductSize,
      Featured: false,
      Top_Rated: false,
      InStock: true,
      DateAdded: new Date(),
    };
    try {
      if (ProductData !== undefined || ProductData !== null) {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .insertOne(ProductData)
          .then((productData) => {
            resolve(productData.insertedId.toString());
          });
      }
    } catch (error) {
      console.log(error);
    }
  });
};
