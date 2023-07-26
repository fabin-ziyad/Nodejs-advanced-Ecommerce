const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports=GetDefaultAddress= (UserId)=>{
    return new Promise(async(resolve, reject) => {
      const DefAddr = await db.get().collection(collection.USERS_COLLECTION).findOne({ _id: ObjectId(UserId) })
      const address = DefAddr.User_Address.filter((addr) => addr.Default === true)
      resolve(address[0])
    })
  }