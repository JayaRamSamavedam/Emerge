import express from 'express';
import verifyAuthToken from '../middlewares/verifyAuthToken.js';
import  checkRoleAccess from '../middlewares/checkroleaccess.js';
import * as controller from '../controllers/productController.js';
// import currencyHandler from '../middlewares/currencyHandler.js';

import requestLogger from '../middlewares/requestlogger.js';
const router = express.Router();



router.post('/colors', controller.createColor);           // Create Color
router.delete('/colors', controller.deleteColor);         // Delete Color
router.get('/colors', controller.getAllColors);         
router.get('/prod/colors', controller.getAllColors);      // Get all colors
router.get('/colors/:id', controller.getColorById);       // Get color by ID
router.put('/colors', controller.editColor); 
router.put("/admin/prod/edit/:id",verifyAuthToken,requestLogger,checkRoleAccess,controller.editPrintFullProduct);
router.post("/admin/prod/cat",verifyAuthToken,requestLogger,checkRoleAccess,controller.createCategory);
// router.post("/admin/prod/item",verifyAuthToken,requestLogger,checkRoleAccess,controller.createItemType);
router.post ("/admin/prod/create",verifyAuthToken,requestLogger,checkRoleAccess,controller.createProduct);
router.get("/prod/get",verifyAuthToken,requestLogger,checkRoleAccess,controller.getAllProducts);
router.get("/prod/getByID/:id",requestLogger,controller.getProductById);
router.get("/prod",requestLogger,controller.fetchProducts);
// router.get("/admin/getAllItemTypes",verifyAuthToken,checkRoleAccess,controller.getAllItemTypes);
router.get("/prod/getAllCategories",controller.getAllCategories);
// router.post("/prod/create-review",verifyAuthToken,checkRoleAccess,controller.createReview);
// router.post("/prod/delete-review",verifyAuthToken,checkRoleAccess,controller.deleteReview);
// router.post("/prod/delete-comment",verifyAuthToken,checkRoleAccess,controller.deleteComment);
// router.get("/prod/getReviewByUser",verifyAuthToken,checkRoleAccess,controller.getReviewByUser);
// router.get("/prod/getByProduct/:productId",verifyAuthToken,controller.getReviewsByProduct);
// router.post("/prod/editComment",verifyAuthToken,checkRoleAccess,controller.editComment);
router.delete("/admin/prod/delete/:id",verifyAuthToken,checkRoleAccess,controller.deleteProductByID);
// productswithhotdeal
// router.get("/prod/gethotdeals",controller.productsWithHotdeal);
// getallsubcategories
// router.get("/prod/getsubcategories",controller.getAllSubCategories);
// deletesubcategories
// router.delete("/admin/prod/deletesubcat",verifyAuthToken,checkRoleAccess,controller.deletedsubcategories)
// editsubcategories
// router.put("/admin/prod/editsubcat",verifyAuthToken,checkRoleAccess,controller.editSubcategory);
// createsubcategory
// router.post("/admin/prod/createsubcat",verifyAuthToken,checkRoleAccess,controller.creatSubcategory);
// editcategoryname
router.put("/admin/prod/editcat",verifyAuthToken,checkRoleAccess,controller.editCategory);
// edit brand
// router.put("/admin/prod/editbrand",verifyAuthToken,checkRoleAccess,controller.editBrand);
// getproductsby brand
// router.get("/prod/getproductsbybrand/:brandname",controller.getProductsByBrand);
// getall brands
// router.get("/prod/getallbrands",controller.getAllBrands);
// resetprioritybybrand
// router.put("/admin/prod/resetprioritybybrand",verifyAuthToken,checkRoleAccess,controller.resetPriorityByBrand);
// setprioritybybrand
// router.put("/admin/prod/setpriority",verifyAuthToken,checkRoleAccess,controller.setPriorityByBrand);
// deletebrand
// router.delete("/admin/prod/deletebrand",verifyAuthToken,checkRoleAccess,controller.deleteBrand);
// editbrandname
// router.put("/admin/prod/editbrandname",verifyAuthToken,checkRoleAccess,controller.editBrandName);
// remove hot deal
// router.put("/admin/prod/removehotdeal",verifyAuthToken,checkRoleAccess,controller.removeHotDeal);
// make product hotdeal
// router.put("/admin/prod/makeproducthotdeal",verifyAuthToken,checkRoleAccess,controller.makeProductHotDeal);
// remove brand sponsers
// router.delete("/admin/prod/removebrandsponsers",verifyAuthToken,checkRoleAccess,controller.removeBrandSponsers);
// create brandsponsers
// router.post("/admin/prod/createbrandsponsers",verifyAuthToken,checkRoleAccess,controller.createBrandSponsers);
// getall brandsponsers
// router.get("/prod/getAllbrandsponsers",controller.getAllbrandsponsers);
// create brand
// router.post("/admin/prod/createbrand",verifyAuthToken,checkRoleAccess,controller.createBrand);
// delete the category
router.delete("/admin/prod/deleteCategory",verifyAuthToken,checkRoleAccess,controller.deleteCategory);

// router.get("/prod/getBrand/:name",verifyAuthToken,checkRoleAccess,controller.getBrandByName);

router.get("/admin/getCategory/:name",verifyAuthToken,checkRoleAccess,controller.getCategory);
// router.get("/admin/getSubcatbycat/:category",verifyAuthToken,checkRoleAccess,controller.getSubCategoryByCategory);

router.get("/prod/getProductsByCategory/:cate",controller.getProductsByCategory);
// router.post("/prod/addAndRemoveFav/:productId",verifyAuthToken,checkRoleAccess,controller.AddAndRemoveFavourites);
// router.get("/prod/getFavourites",verifyAuthToken,checkRoleAccess,controller.FavouriteProducts);
router.get("/prod/search",controller.search);
// router.get("/admin/getsubcat/:name",controller.getSubCategory);
router.get("/prod/filter",controller.filters);
router.post("/prod/addAndRemoveFav/:productId",verifyAuthToken,requestLogger,checkRoleAccess,controller.AddAndRemoveFavourites);
router.get("/prod/getFavourites",verifyAuthToken,requestLogger,checkRoleAccess,controller.FavouriteProducts);
router.post("/prod/addfav",verifyAuthToken,requestLogger,controller.addToFav);
router.post("/prod/remfav",verifyAuthToken,requestLogger,controller.remToFav);
router.post("/admin/prod/addcatprod",verifyAuthToken,requestLogger,controller.AddProductToCategory);
router.get("/prod/catprod/:catname",requestLogger,controller.getProductsByCategoryPrintfull);
export default router;