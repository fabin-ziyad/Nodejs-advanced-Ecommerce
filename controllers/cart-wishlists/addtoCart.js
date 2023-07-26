const db = require("../../config/connection");
const collection = require("../../config/collection");
const ObjectId = require("mongodb").ObjectId;
const fetchUserCart=require('../../common-functions/fetchUserCart')
module.exports = addtoCart = (ProductId, UserId, ReqData) => {
  ReqData.qty = parseInt(ReqData.qty); //converting to integer
  return new Promise(async (resolve, reject) => {
    try {
      //Creating Object with product id and req.body data
      let CartItemsObj = {
        UniqueId: new ObjectId(),
        item: ObjectId(ProductId),
        quantity: ReqData.qty,
        color: ReqData.Colour,
        Size: ReqData.size,
      };
      //Removed the unwanted fields and saved to new  updatedObject
      const { quantity, color, Size, ...updatedObject } = CartItemsObj;

      //fetching the User's cart
      let UserCart = await fetchUserCart(UserId);
      if (UserCart) {
        //Finding the index of product to check exists. If exists the array return 0 else array return -1
        let ProductExists = UserCart.products.findIndex(
          (ProductsIndexs) =>
            ProductsIndexs.item == ProductId &&
            ProductsIndexs.color == ReqData.Colour &&
            ProductsIndexs.Size == ReqData.size
        );
        //If product exists increment its qauntity according to req.body.qty
        if (ProductExists != -1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              {
                user: ObjectId(UserId),
                "products.item": ObjectId(ProductId),
              },
              {
                $inc: { "products.$.quantity": ReqData.qty },
              }
            );

          resolve({ Status: true });
          //if product not exists ,add the object to products array under an user
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectId(UserId) },
              {
                $push: { products: CartItemsObj },
              }
            )
            .then(() => {
              //Adding the UsercartItem object to Cart_Items Array inside this user's collection
              db.get()
                .collection(collection.USERS_COLLECTION)
                .updateOne(
                  { _id: ObjectId(UserId) },
                  {
                    $push: { Cart_Items: updatedObject },
                  }
                )
                .then(() => {
                  resolve({ Status: true });
                });
            });
        }
      } //Creating a Cart under user if user havent cart
      else {
        let CartObj = {
          user: ObjectId(UserId),
          products: [CartItemsObj],
        };

        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(CartObj)
          .then(() => {
            //Adding the UsercartItem object to Cart_Items Array inside this user's collection
            db.get()
              .collection(collection.USERS_COLLECTION)
              .updateOne(
                { _id: ObjectId(UserId) },
                {
                  $push: { Cart_Items: updatedObject },
                }
              )
              .then(() => {
                resolve({ Status: true });
              });
          });
      }
    } catch (error) {
      console.log(error);
    }
  });
};
