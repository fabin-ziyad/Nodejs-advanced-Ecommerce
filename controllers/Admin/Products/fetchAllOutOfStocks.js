const db = require("../../../config/connection");
const collection = require("../../../config/collection");
module.exports=fetchOutOfStocks=()=>{
    return new Promise(async(resolve, reject) => {
       let fetchAllStockOutProd=await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        {
            $match: { InStock: false }, 
        },
        {
            $lookup:{
                from:collection.MAIN_CATEGORY_COLLECTION,
                let: { mainCategory: { $toObjectId: "$MainCategory" } },
                pipeline: [
                    {
                      $match: { $expr: { $eq: ["$_id", "$$mainCategory"] } },
                    },
                ],
                as: "MainCategoryData",
            }
        },
      
        {
            $lookup:{
                from:collection.SUB_CATEGORY_COLLECTION,
                let: { subCategory: { $toObjectId: "$SubCategory" } },
                pipeline: [
                    {
                      $match: { $expr: { $eq: ["$_id", "$$subCategory"] } },
                    },
                ],
                as: "SubCategoryData",
            }
        },
        {
            $project:{
                SubCategory:"$SubCategoryData.SubCategory",
                MainCategory:"$MainCategoryData.Category_Name",
                ProductName:"$ProductName",
                ProductPrice:"$ProductPrice",
                ProductQuantity:"$ProductQuantity",
                FullDescription:"$FullDescription",
                ShortDescription:"$ShortDescription",
                ProductSize:"$ProductSize",
                Colors:"$Colors",
                Gender:"$Gender"
            }
        },
       ]).toArray()
       resolve(fetchAllStockOutProd)
    })
}