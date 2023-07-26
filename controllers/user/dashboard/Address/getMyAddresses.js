const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
const ObjectId = require("mongodb").ObjectId;
module.exports = getAddressess = (UserId) => {
  return new Promise(async (resolve, reject) => {
    let Addresses = await db
      .get()
      .collection(collection.USERS_COLLECTION)
      .aggregate([
        {
          $match: { _id: ObjectId(UserId) },
        },
        {
          $unwind: "$User_Address",
        },
        {
          $project: {
            Address_UniqueId: "$User_Address.Address_UniqueId",
            First_Name: "$User_Address.First_Name",
            Last_Name: "$User_Address.Last_Name",
            Company_Name: "$User_Address.Company_Name",
            Country: "$User_Address.Country",
            Street_Address: "$User_Address.Street_Address",
            Street_Address1: "$User_Address.Street_Address1",
            City: "$User_Address.City",
            State: "$User_Address.State",
            Zip_Code: "$User_Address.Zip_Code",
            Phone_Number: "$User_Address.Phone_Number",
            Email: "$User_Address.Email",
            Default: "$User_Address.Default",
          },
        },
      ])
      .toArray();
    resolve(Addresses);
  });
};
