const express = require('express')
const router = express.Router()

// middlewares
const authToken = require("../middleware/authToken");
const adminPermissionMiddleware = require('../middleware/adminPermissionMiddleware');

// admin controllers
const authController = require("../controllers/admin/authController");
const userController = require("../controllers/admin/userController");
const productRouts = require('../controllers/admin/ProductController');
const categoryController = require('../controllers/admin/CategoryController');
const shopCategoryController = require('../controllers/admin/shopCategoryController');
const pageController = require('../controllers/admin/PageController');



//frontend controllers
const frontendProduct = require('../controllers/frontendPages/ProductController');
const checkoutController = require('../controllers/frontendPages/checkoutController');
const cartController = require('../controllers/frontendPages/cartController');

// public routes
router.get("/product-list",frontendProduct.productList)
router.get("/product/:id", frontendProduct.getProductById)
router.get("/featured-products",frontendProduct.featuredProducts)
router.get("/product/related/:category/:productId", frontendProduct.getRelatedProducts)
router.get("/search", frontendProduct.searchProduct)

//cart
router.post("/cart/add", authToken, cartController.addToCart)
router.get("/cart", authToken, cartController.getCart)
router.put("/cart/update/:productId", authToken, cartController.updateCartItem)
router.delete("/cart/remove/:productId", authToken, cartController.removeCartItem)

// Checkout
router.post("/create-checkout-session", authToken, checkoutController.createCheckoutSession);

// auth routes
router.post("/signup",authController.userSignUp)
router.post("/signin",authController.userSignIn)
router.get("/signout",authController.userSignout)

// admin routes
router.get("/get-all-users", authToken, adminPermissionMiddleware, userController.getUserAll);
router.get("/user-details", authToken, userController.userDetails);
router.put("/update-user/:id", authToken, adminPermissionMiddleware, userController.updateUser);

//category
router.get("/categories", authToken, adminPermissionMiddleware, categoryController.getAllCategory);
router.post("/categories", authToken, adminPermissionMiddleware, categoryController.createCategory);
router.get("/categories/:id", authToken, adminPermissionMiddleware, categoryController.getCategoryById);
router.put("/categories/:id", authToken, adminPermissionMiddleware, categoryController.updateCategory);
router.delete("/categories/:id", authToken, adminPermissionMiddleware, categoryController.deleteCategory);

//products
router.get("/products", authToken, adminPermissionMiddleware, productRouts.getAllProducts);
router.post("/products", authToken, adminPermissionMiddleware, productRouts.createProduct);
router.get("/products/:id", authToken, adminPermissionMiddleware, productRouts.getProductById);
router.put("/products/:id", authToken, adminPermissionMiddleware, productRouts.updateProduct);
router.delete("/products/:id", authToken, adminPermissionMiddleware, productRouts.deleteProduct);

//shop category
router.get("/shop-categories", authToken, adminPermissionMiddleware, shopCategoryController.getAllShopCategories);
router.post("/shop-categories", authToken, adminPermissionMiddleware, shopCategoryController.createShopCategory);
router.get("/shop-categories/:id", authToken, adminPermissionMiddleware, shopCategoryController.getShopCategoryById);
router.put("/shop-categories/:id", authToken, adminPermissionMiddleware, shopCategoryController.updateShopCategory);
router.delete("/shop-categories/:id", authToken, adminPermissionMiddleware, shopCategoryController.deleteShopCategory);

//pages
router.get("/pages", authToken, adminPermissionMiddleware, pageController.getAllPages);
router.post("/pages", authToken, adminPermissionMiddleware, pageController.createPage);
router.get("/pages/:id", authToken, adminPermissionMiddleware, pageController.getPageById);
router.put("/pages/:id", authToken, adminPermissionMiddleware, pageController.updatePage);
router.delete("/pages/:id", authToken, adminPermissionMiddleware, pageController.deletePage);


module.exports = router
