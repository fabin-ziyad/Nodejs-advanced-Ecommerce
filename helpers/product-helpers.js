var db = require("../config/connection");
var collection = require("../config/collection");
var objectId = require("mongodb").ObjectId;
var bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
module.exports = {
  /////////////ADMIN/////////////////////
  GetAdmin: () => {
    return new Promise(async(resolve, reject) => {
      let Admin = await db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
      resolve(Admin[0])
    })
  },

  UpdateAdminProfle: async(ReqData) => {
    return new Promise(async(resolve, reject) => {
      ReqData.AdminNewPass= await bcrypt.hash(ReqData.AdminNewPass,10)
      db.get().collection(collection.ADMIN_COLLECTION).updateOne({ _id: objectId(ReqData.MatchId)},
      {
        $set: {
          AdminName: ReqData.AdminUserName,
          AdminEmail: ReqData.AdminEmail,
          AdminFirstName: ReqData.AdminFirstName,
          AdminLastName: ReqData.AdminLastName,
          AdminPass: ReqData.AdminNewPass,
        }
        }).then(() => {
        resolve()
      })
    }).catch((err) => {
      reject(err);
    });
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////PRODUCTS/////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////ADD PRODUCTS/////////////////////

  addproducts: (products) => {
    let ProductData = {
      ...products,
    Status : JSON.parse("true"),
    ProductPrice : parseInt(products.ProductPrice),
    MRP :parseInt(products.MRP),
    ProductQuantity:parseInt(products.ProductQuantity),
    New_Arrival : false,
    Colors :products.Colors,
    ProductSize :products.ProductSize,
    Featured : false,
    Top_Rated : false,
    InStock:true,
    DateAdded : new Date()
    }
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .insertOne(ProductData)
        .then((productData) => {
          resolve(productData.insertedId.toString());
        });
    });
  },

  /////////////LIST PRODUCTS/////////////////////

  listProducts: () => {
    return new Promise(async (resolve, reject) => {
      let productlists = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
          {
            $lookup: {
              from: collection.MAIN_CATEGORY_COLLECTION,
              let: { parentId: { $toObjectId: "$MainCategory" } },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$parentId"] } },
                },
              ],
              as: "MainCategoryData",
            },
          },
          {
            $lookup: {
              from: collection.SUB_CATEGORY_COLLECTION,
              let: { subCategoryId: { $toObjectId: "$SubCategory" } },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$subCategoryId"] } },
                },
              ],
              as: "SubacategoryData",
            },
          },
          

          {
            $project: {
              _id: 1,
              ProductName: 1,
              MainCategory: {
                $arrayElemAt: ["$MainCategoryData.Category_Name", 0],
              },
              SubCategory: {
                $arrayElemAt: ["$SubacategoryData.SubCategory", 0],
              },
              MainCategoryId: "$MainCategory",
              SubCategoryId: "$SubCategory",
              ProductPrice: 1,
              ProductQuantity: 1,
              ShortDescription: 1,
              FullDescription: 1,
              ProductTags: 1,
              ProductSize: 1,
              Colors: 1,
              Status: 1,
              Gender: 1,
              New_Arrival: 1,
              Featured: 1,
              Top_Rated: 1,
              MRP: 1,
              BrandName:1,
              InStock:1
            },
          },
        ])
        .toArray();
      resolve(productlists);
    });
  },

  UpdateProduct: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData.UpdateProductId)},
        {
          $set:{
            ProductName: ReqData.ProductName,
            ProductPrice: ReqData.ProductPrice,
            ProductQuantity: ReqData.ProductQuantity,
            FullDescription: ReqData.FullDescription,
            ShortDescription: ReqData.ShortDescription,
            BrandName:ReqData.BrandName,
            Colors: ReqData.Colors,
            ProductSize: ReqData.ProductSize,
            MRP:ReqData.MRP
          }
        }).then((response) => {
          resolve(ReqData.UpdateProductId)        
        })
    })
  },
  DisableProduct: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
          Status:false
        }
      }).then(() => {
        resolve()
      })
    })
  },
  EnableProduct: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
          Status:true
        }
      }).then(() => {
        resolve()
      })
    })
  },
  GetProductDetails: (ProductId) => {
    return new Promise(async (resolve, reject) => {
      let GetProduct = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .aggregate([
          {
          $match:{_id:objectId(ProductId)}
        },
          {
            $lookup: {
              from: collection.MAIN_CATEGORY_COLLECTION,
              let: { parentId: { $toObjectId: "$MainCategory" } },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$parentId"] } },
                },
              ],
              as: "MainCategoryData",
            },
          },
          {
            $lookup: {
              from: collection.SUB_CATEGORY_COLLECTION,
              let: { subCategoryId: { $toObjectId: "$SubCategory" } },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$subCategoryId"] } },
                },
              ],
              as: "SubacategoryData",
            },
          },
          

          {
            $project: {
              _id: 1,
              ProductName: 1,
              MainCategory: {
                $arrayElemAt: ["$MainCategoryData.Category_Name", 0],
              },
              SubCategory: {
                $arrayElemAt: ["$SubacategoryData.SubCategory", 0],
              },
              MainCategoryId: "$MainCategory",
              SubCategoryId: "$SubCategory",
              ProductPrice: 1,
              ProductQuantity: 1,
              ShortDescription: 1,
              FullDescription: 1,
              ProductTags: 1,
              ProductSize: 1,
              BrandName:1,
              Colors:1,
              Status: 1,
              Gender: 1,
              New_Arrival: 1,
              Featured: 1,
              Top_Rated: 1,
              MRP:1
            },
          },
        ])
        .toArray();
      resolve(GetProduct[0]);
    });
  
  },
  DeleteProduct: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(ReqData.ProductId) }).then((response) => {
        resolve(ReqData.ProductId)
      })
    })
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////MAIN CATEGORY/////////////////////
  
  /////////////ADD MAIN CATEGORY/////////////////////
  AddMainCategory: (MainCategoryData) => {
    MainCategoryData.Status = JSON.parse("true");
    return new Promise(async (resolve, reject) => {
      MainCategoryData.Category_Name =
        MainCategoryData.Category_Name.toUpperCase();
      let MaiCatExists = await db
        .get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .findOne({ Category_Name: MainCategoryData.Category_Name });
      if (!MaiCatExists) {
        db.get()
          .collection(collection.MAIN_CATEGORY_COLLECTION)
          .insertOne(MainCategoryData)
          .then((ResultId) => {
            resolve(ResultId.insertedId.toString());
          });
      } else {
        resolve(false);
      }
    });
  },

  /////////////UPDATE MAIN CATEGORY/////////////////////
  UpdateMainCategory: (UpdateData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.MAIN_CATEGORY_COLLECTION).updateOne({ _id: objectId(UpdateData.ID) },
        {
          $set: { Category_Name:UpdateData.UpdatedMainCat }
        }).then(() => {
          resolve()
        })
    })
  },

  /////////////ALL MAIN CATEGORY/////////////////////
  GetMainCategories: () => {
    return new Promise(async (resolve, reject) => {
      let MainCategories = await db
        .get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: collection.SUB_CATEGORY_COLLECTION,
              let: { mainId: { $toObjectId: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toObjectId: "$parentCategory" }, "$$mainId"],
                    },
                  },
                },
              ],
              as: "SubCategoryData",
            },
          },

          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              let: { mainCatId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toObjectId: "$MainCategory" }, "$$mainCatId"],
                    },
                  },
                },
                { $count: "Count" },
              ],
              as: "MainCatProducts",
            },
          },
          {
            $project: {
              Status: 1,
              Category_Name: 1,
              SubCatId: "$SubCategoryData._id",
              SubCategoryLength: { $size: "$SubCategoryData" },
              SubCategoryName: "$SubCategoryData.SubCategory",
              MainproductsCount: { $first: "$MainCatProducts.Count" },
            },
          },
        ])
        .toArray();
      resolve(MainCategories);
    });
  },

  /////////////DISABLE MAIN CATEGORY/////////////////////
  DisableMainCat: (MainCatId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .updateOne(
          { _id: objectId(MainCatId)},
          {
            $set: {
              Status: false,
            },
          }
        )
        .then(() => {
          db.get()
            .collection(collection.SUB_CATEGORY_COLLECTION)
            .updateMany(
              { parentCategory: MainCatId },
              {
                $set: {
                  Status: false,
                },
              }
          ).then(() => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ MainCategory: MainCatId },
              {
              $set:{Status:false}
            }) 
            })
        })
      resolve()
    });
  },

  /////////////ENABLE MAIN CATEGORY/////////////////////
  EnableMainCat: (MainCatId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.MAIN_CATEGORY_COLLECTION)
        .updateOne(
          { _id: objectId(MainCatId) },
          {
            $set: {
              Status: true,
            },
          }
        )
        .then(() => {
          db.get()
            .collection(collection.SUB_CATEGORY_COLLECTION)
            .updateMany(
              { parentCategory: MainCatId },
              {
                $set: {
                  Status: true,
                },
              }
          ).then(() => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ MainCategory: MainCatId },
              {
              $set:{Status:true}
            }) 
            })
        })
      resolve()
    })
  },


  DeleteMainCat: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.MAIN_CATEGORY_COLLECTION).deleteOne({ _id: objectId(ReqData.MainCatId)}).then(() => {
        db.get()
            .collection(collection.SUB_CATEGORY_COLLECTION)
            .deleteMany(
              { parentCategory: ReqData.MainCatId }
          ).then(() => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteMany({ MainCategory: ReqData.MainCatId }) 
            })
        })
        resolve()
      })
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////SUB CATEGORY/////////////////////
  
  /////////////ADD SUB CATEGORY/////////////////////
  AddSubCategory: (SubCategoryData) => {
    SubCategoryData.Status = JSON.parse("true");
    SubCategoryData.SubCategory = SubCategoryData.SubCategory.toLowerCase();
    return new Promise(async (resolve, reject) => {
      let SubCatExists = await db
        .get()
        .collection(collection.SUB_CATEGORY_COLLECTION)
        .aggregate([
          {
            $match: {
              $expr: {
                $eq: [SubCategoryData.parentCategory, "$parentCategory"],
              },
            },
          },
          {
            $match: {
              $expr: { $eq: [SubCategoryData.SubCategory, "$SubCategory"] },
            },
          },
        ])
        .toArray();
      if (SubCatExists.length == 0) {
        db.get()
          .collection(collection.SUB_CATEGORY_COLLECTION)
          .insertOne(SubCategoryData)
          .then((responseId) => {
            resolve(responseId);
          });
      } else {
        resolve(false);
      }
    });
  },


  /////////////ALL SUB CATEGORY/////////////////////
  AllSubCategory: () => {
    return new Promise(async (resolve, reject) => {
      FullSubCategory = await db
        .get()
        .collection(collection.SUB_CATEGORY_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: collection.MAIN_CATEGORY_COLLECTION,
              let: { parentid: { $toObjectId: "$parentCategory" } },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$parentid"] } },
                },
              ],
              as: "MainCategoryData",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              let: { subCatId: { $toObjectId: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toObjectId: "$SubCategory" }, "$$subCatId"],
                    },
                  },
                },
                { $count: "Count" },
              ],
              as: "Products",
            },
          },
          {
            $project: {
              SubCatId: "$_id",
              Status: 1,
              MainCategoryName: {
                $first: "$MainCategoryData.Category_Name",
              },
              SubCategory: 1,
              parentCategory: 1,
              subCatProductCount: { $first: "$Products.Count" },
            },
          },
        ])
        .toArray();
      resolve(FullSubCategory);
    });
  },

  subCatUnderMainCat: (parentId) => {
    return new Promise(async (resolve, reject) => {
      const SubCat = await db.get().collection(collection.SUB_CATEGORY_COLLECTION).aggregate([
        {
          $match: {
            $expr: {
              $eq: [parentId, "$parentCategory"],
            },
          },
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            let: { parentid: { $toObjectId: "$parentCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$parentid"] } },
              },
            ],
            as: "MainCategoryData",
          },
        },
        {
          $lookup: {
            from: collection.PRODUCT_COLLECTION,
            let: { subCatId: { $toObjectId: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: "$SubCategory" }, "$$subCatId"],
                  },
                },
              },
              { $count: "Count" },
            ],
            as: "Products",
          },
        },
        
        {
          $project: {
            _id:1,
            Status: 1,
            SubCategory: 1,
            // parentCategory: 1,
            subCatProductCount: { $first: "$Products.Count" },
            MainCategoryName: {
              $first: "$MainCategoryData.Category_Name",
            }
          },
        },
      ]).toArray();
  
      resolve(SubCat);
    })
  },
  /////////////UPDATE SUB CATEGORY/////////////////////
  UpdateSubCat: (UpdateSubCatData) => {

    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.SUB_CATEGORY_COLLECTION)
        .updateOne(
          { _id: objectId(UpdateSubCatData.SUBID) },
          {
            $set: {
              SubCategory: UpdateSubCatData.UpdatedSubCat,
              parentCategory:UpdateSubCatData.parentCategory
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  /////////////DISABLE SUB CATEGORY/////////////////////
  DisbaleSubCat: (SubCatId) => {
 
    return new Promise((resolve, reject) => {
      db.get().collection(collection.SUB_CATEGORY_COLLECTION).updateOne({ _id: objectId(SubCatId) },
        {
          $set: {
          Status:false
        }
        }).then(() => {
          db.get().collection(collection.PRODUCT_COLLECTION).updateMany({SubCategory:SubCatId },
            {
              $set: {
              Status:false
            }
          })
        }).then(() => {
        resolve()
      })
  })
},
  DeleteSubCat: (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get().collection(collection.SUB_CATEGORY_COLLECTION).deleteOne({ _id: objectId(ReqData)}).then(() => {
      resolve()
    })
  })
},
/////////////ENABLE SUB CATEGORY/////////////////////
EnableSubCat: (SubCatId) => {
  return new Promise((resolve, reject) => {
    db.get().collection(collection.SUB_CATEGORY_COLLECTION).updateOne({ _id: objectId(SubCatId) },
    {
      $set: {
      Status:true
    }
    }).then(() => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ SubCategory:SubCatId},
        {
          $set: {
          Status:true
        }
      })
    }).then(() => {
    resolve()
  })
})
  },
  DeleteSubCat: (ReqData) => {
  return new Promise((resolve, reject) => {
    db.get().collection(collection.SUB_CATEGORY_COLLECTION).deleteOne({ _id: objectId(ReqData.SubCatId) }).then(() => {
      db.get().collection(collection.PRODUCT_COLLECTION).deleteMany({ SubCategory: ReqData.SubCatId }).then(() =>{
        resolve()
      })
    })
  })
},
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  AllActiveCount: () => {
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
  },
  
  AllInactiveCount: () => {
    let Inactives = JSON.parse('false')
    return new Promise(async(resolve, reject) => {
      let Counts = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        {
       $match:{$expr:{$eq:["$Status",Inactives]}}
        },
        {
          $count:'InactiveCounts'
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            pipeline: [
              {
                $match:{$expr:{$eq:["$Status",Inactives]}}
              },
              {
                $count:'InactiveMainCats'
              },
            ],
            as:'InactiveMainCatsCount'
          }
        },
        {
          $lookup: {
            from: collection.SUB_CATEGORY_COLLECTION,
            pipeline: [
              {
                $match:{$expr:{$eq:["$Status",Inactives]}}
              },
              {
                $count:'InactiveSubCats'
              },
            ],
            as:'InactiveSubCatsCount'
          }
        },
       
        {
          $project: {
            InactiveProducts: "$InactiveCounts",
            InactiveMainCats: { $first: "$InactiveMainCatsCount.InactiveMainCats" },
            InactiveSubCats: { $first: "$InactiveSubCatsCount.InactiveSubCats" },
          }
        }
    ])
      resolve(Counts[0])
    })
  },
  
  Activate_Arrivals: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
            New_Arrival:true
        }
      }).then(() => {
        resolve()
      })
    })
  },

  Deactivate_Arrivals: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
            New_Arrival:false
        }
      }).then(() => {
        resolve()
      })
    })
  },
  Inactivate_Featured: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
          Featured:false
        }
        }).then(() => {
        resolve()
      })
    })
  },
  Activate_Featured: (ReqData) => {
   return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
          Featured:true
        }
        }).then(() => {
        resolve()
      })
    })
  },
 
  Activate_TopRated: (ReqData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
          Top_Rated:true
        }
      }).then(() => {
        resolve()
      })
    })
  },
  Inactivate_TopRated: (ReqData) => {

    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(ReqData) },
        {
          $set: {
          Top_Rated:false
        }
      }).then(() => {
        resolve()
      })
    })
  },
  OutOfStock: (ProductId) => {

    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(ProductId) },
        {
        $set:{InStock:false}
        }).then(() => {
        resolve({status:true})
      })
    })
  },
  InStock: (ProductId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(ProductId) },
        {
        $set:{InStock:true}
        }).then(() => {
        resolve({status:true})
      })
    })
  },
  getProductsByCategory: (subCatId) => {
    return new Promise(async(resolve, reject) => {
      const Products = await db.get().collection(collection.PRODUCT_COLLECTION).find({ SubCategory: subCatId ,Status:true}).toArray()
      const SubCat = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        {
          $match: {
            $expr: {
              $eq: [subCatId, "$SubCategory"],
            },
          },
        },
        {
          $lookup: {
            from: collection.SUB_CATEGORY_COLLECTION,
            let: { subCatId: { $toObjectId: "$SubCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$subCatId"] } },
              },
            ],
            as: "SubCategoryData",
          },
        },
        {
          $lookup: {
            from: collection.MAIN_CATEGORY_COLLECTION,
            let: { mainCatId: { $toObjectId: "$MainCategory" } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$mainCatId"] } },
              },
            ],
            as: "MainCategoryData",
          },
        },    
        {
          $project: {
            _id:1,
            Status: 1,
            SubCategoryName: {
              $first: "$SubCategoryData.SubCategory",
            },
            mainCategoryName: {
              $first: "$MainCategoryData.Category_Name",
            }
          },
        },
      ]).toArray();
   
      Data_to_pass = {
        Products,
        SubCategoryName: SubCat[0]?.SubCategoryName,
        MainCategoryName: SubCat[0]?.mainCategoryName,
      }
      resolve(Data_to_pass);
    })
  },
  filterProductsByMainCat: (ID) => {
    return new Promise(async(resolve, reject) => {
      let Products = await db.get().collection(collection.PRODUCT_COLLECTION).find({ MainCategory:ID }).toArray()
      resolve(Products)
    })
  },
  
  // StockOutProducts: () => {
  //   return new Promise(async(resolve, reject) => {
  //     let AllStockOutProduct = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
  //     console.log(AllStockOutProduct);
  //     resolve(AllStockOutProduct[0])
  //   })
  // }
};


