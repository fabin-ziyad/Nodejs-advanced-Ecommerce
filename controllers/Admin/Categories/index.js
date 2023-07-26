module.exports = {
  //Sub Cats
  deleteSubCategory: require("./subCategory/deleteSubCat"),
  disableSubCategory: require("./subCategory/disableSubCats"),
  enableSubCategory: require("./subCategory/enableSubCat"),
  updateSubCategory: require("./subCategory/updateSubCat"),
  addSubCategory: require("./subCategory/addSubCat"),
  getSubCategoryUnderMain: require("./subCategory/SubCatUnderMain"),
  getAllSubCategories: require("./subCategory/getSubCategories"),

  // Main Cats
  getMainCategories: require("./mainCategory/getMainCategories"),
  addMainCategory: require("./mainCategory/addMainCat"),
  disableMainCategory: require("./mainCategory/disableMainCat"),
  enableMainCategory: require("./mainCategory/enableMainCat"),
  updateMainCategory: require("./mainCategory/updateMainCat"),
  deleteMainCategory: require("./mainCategory/deleteMainCat"),
  activeMainCategories:require("./mainCategory/activeCategories")
};
