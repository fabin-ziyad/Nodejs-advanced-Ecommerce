const db = require("../../../../config/connection");
const collection = require("../../../../config/collection");
module.exports=AllActiveCount= () => {
    let Actives = JSON.parse('true')
    return new Promise(async(resolve, reject) => {
      let Counts = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        {
          $match:{$expr:{$eq:["$Status",Actives]}}
        },
        {
          $count:'ActiveCounts'
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            pipeline: [
              {
                $match:{$expr:{$eq:["$Status",Actives]}}
              },
              {
                $count:'ActiveMainCats'
              },
            ],
            as:'ActiveMainCatsCount'
          }
        },
        {
          $lookup: {
            from: collection.SUB_CATEGORY_COLLECTION,
            pipeline: [
              {
                $match:{$expr:{$eq:["$Status",Actives]}}
              },
              {
                $count:'ActiveSubCats'
              },
            ],
            as:'ActiveSubCatsCount'
          }
        },
       
        {
          $project: { 
            ActiveProducts: "$ActiveCounts",
            ActiveMainCats: { $first: "$ActiveMainCatsCount.ActiveMainCats" },
            ActiveSubCats: { $first: "$ActiveSubCatsCount.ActiveSubCats" },
          }
        }
      ]).toArray()
      

      resolve(Counts[0])
    })
  }