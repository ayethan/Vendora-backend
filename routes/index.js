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

// This route only requires authentication, not admin permission, so it stays separate.
router.get("/user-details", authToken, userController.userDetails);

// --- Admin Routes ---
// Create a new router for admin-only routes
const adminRouter = express.Router();

// Apply authentication and admin permission middleware to all routes in adminRouter
adminRouter.use(authToken, adminPermissionMiddleware);

// user management
adminRouter.get("/get-all-users", userController.getUserAll);
adminRouter.put("/update-user/:id", userController.updateUser);

//category
adminRouter.get("/categories", categoryController.getAllCategory);
adminRouter.post("/categories", categoryController.createCategory);
adminRouter.get("/categories/:id", categoryController.getCategoryById);
adminRouter.put("/categories/:id", categoryController.updateCategory);
adminRouter.delete("/categories/:id", categoryController.deleteCategory);

//products
adminRouter.get("/products", productRouts.getAllProducts);
adminRouter.post("/products", productRouts.createProduct);
adminRouter.get("/products/:id", productRouts.getProductById);
adminRouter.put("/products/:id", productRouts.updateProduct);
adminRouter.delete("/products/:id", productRouts.deleteProduct);

//shop category
adminRouter.get("/shop-categories", shopCategoryController.getAllShopCategories);
adminRouter.post("/shop-categories", shopCategoryController.createShopCategory);
adminRouter.get("/shop-categories/:id", shopCategoryController.getShopCategoryById);
adminRouter.put("/shop-categories/:id", shopCategoryController.updateShopCategory);
adminRouter.delete("/shop-categories/:id", shopCategoryController.deleteShopCategory);

//pages
adminRouter.get("/pages", pageController.getAllPages);
adminRouter.post("/pages", pageController.createPage);
adminRouter.get("/pages/:id", pageController.getPageById);
adminRouter.put("/pages/:id", pageController.updatePage);
adminRouter.delete("/pages/:id", pageController.deletePage);

// Mount the admin router into the main router
router.use(adminRouter);

module.exports = router
