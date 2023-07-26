const fetchUserCart=require('../../common-functions/fetchUserCart')
module.exports = getCartCount = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = 0;
      let Cart = await fetchUserCart(UserId);
      if (Cart && Cart !==undefined ||Cart !==null) {
        count = Cart.products.length;
      }else{
        count= 0
      }
      resolve(count);
    } catch (error) {
      reject(error)
    }
  });
};
