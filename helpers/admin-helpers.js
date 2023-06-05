var db = require('../config/connection')
var collection = require('../config/collection')
var objectid = require('mongodb').ObjectId
var bcrypt = require("bcrypt");
module.exports = {
    adminLogin: (credentials) => {
        return new Promise(async (resolve, reject) => {
            let responses={}
            let AdminData = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ AdminName: credentials.AdminName })
            if (AdminData) {
                bcrypt.compare(credentials.AdminPass, AdminData.AdminPass).then((DataResponse) => {
                    if (DataResponse) {
                        console.log('Admin Logged in')
                        responses.AdminData = AdminData
                        responses.DataResponse = true    
                        resolve(responses)
                    } else {
                        console.log('error in credentials');
                        resolve({ DataResponse: false })
                    }
                })
            }
        })
    },
    GetAllUser: () => {
        return new Promise(async(resolve, reject) => {
            let AllUser=await  db.get().collection(collection.USERS_COLLECTION).find({}).toArray()
            resolve(AllUser)
        })
    }
}