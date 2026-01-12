const express = require('express')
const router = express.Router()

// middlewares
const authToken = require("../middleware/authToken");
const adminPermissionMiddleware = require('../middleware/permissions/adminPermissionMiddleware');
const partnerPermissionMiddleware = require('../middleware/permissions/partnerPermissionMiddleware');
const memberPermissionMiddleware = require('../middleware/permissions/memberPermissionMiddleware');

// admin controllers
const authController = require("../controllers/admin/authController");
const userController = require("../controllers/admin/userController");
const productRoutes = require('../controllers/admin/ProductController');
const categoryController = require('../controllers/admin/CategoryController');
const shopCategoryController = require('../controllers/admin/shopCategoryController');
const pageController = require('../controllers/admin/PageController');
const restaurantController = require('../controllers/admin/restaurantController');
const cuisineController = require('../controllers/admin/cuisineController');

// partner controllers
const partnerAuthController = require("../controllers/partner/authController");
router.post("/partner/signin", partnerAuthController.partnerSignIn);

// Import upload middleware
const upload = require('../middleware/upload');

//frontend controllers
const frontendProduct = require('../controllers/frontendPages/ProductController');
const checkoutController = require('../controllers/frontendPages/checkoutController');
const cartController = require('../controllers/frontendPages/cartController');
const frontendAuthController = require('../controllers/frontendPages/authController');

// Import auth routes
const authRoutes = require('./authRoutes');
const partnerRoutes = require('./partnerRoutes');

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

// --- Auth Routes ---
// Member
router.post("/signup", frontendAuthController.memberSignup);
router.post("/signin", frontendAuthController.memberSignin);
router.get("/signout", frontendAuthController.memberSignout);
router.get("/member/me", authToken, memberPermissionMiddleware, frontendAuthController.getMemberDetails);

// Admin
router.post("/admin/signin", authController.adminSignIn);
router.get("/admin/signout", authController.adminSignout);

// Restaurant
router.post("/partner/register", upload.single('restaurantImage'), authController.restaurantSignUp);


// Mount social auth routes
router.use('/auth', authRoutes);

router.get("/restaurants/frontend", restaurantController.getAllFrontendRestaurants);
router.get("/restaurants/:slug", restaurantController.getRestaurantBySlug);

router.get("/cuisines/frontend", cuisineController.getAllCuisinesFrontend);


// --- Admin Routes ---
const adminRouter = express.Router();
adminRouter.use(authToken, adminPermissionMiddleware);

// self-details
adminRouter.get("/me", userController.getAdminDetails);

// user management
adminRouter.get("/get-all-users", userController.getUserAll);
adminRouter.put("/update-user/:id", userController.updateUser);

//category
adminRouter.get("/categories", categoryController.getAllCategory);
adminRouter.post("/categories", categoryController.createCategory);
adminRouter.get("/categories/:id", categoryController.getCategoryById);
adminRouter.put("/categories/:id", categoryController.updateCategory);
adminRouter.delete("/categories/:id", categoryController.deleteCategory);

//cuisine
adminRouter.get("/cuisines", cuisineController.getAllCuisines);
adminRouter.post("/cuisines", cuisineController.createCuisine);
adminRouter.get("/cuisines/:id", cuisineController.getCuisineById);
adminRouter.put("/cuisines/:id", cuisineController.updateCuisine);
adminRouter.delete("/cuisines/:id", cuisineController.deleteCuisine);

//products
adminRouter.get("/restaurants/:restaurantId/products", productRoutes.getProductsByRestaurant);
adminRouter.post("/restaurants/:restaurantId/products", productRoutes.createProduct);
adminRouter.get("/restaurants/:restaurantId/products/:id", productRoutes.getProductById);
adminRouter.put("/restaurants/:restaurantId/products/:id", productRoutes.updateProduct);
adminRouter.delete("/restaurants/:restaurantId/products/:id", productRoutes.deleteProduct);

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

//restaurants
adminRouter.get("/restaurants", restaurantController.getAllRestaurants);
adminRouter.post("/restaurants", restaurantController.createRestaurant);
adminRouter.get("/restaurants/:id", restaurantController.getRestaurantById);
adminRouter.put("/restaurants/:id", restaurantController.updateRestaurant);
adminRouter.delete("/restaurants/:id", restaurantController.deleteRestaurant);

// Mount the admin router into the main router
router.use('/admin', adminRouter);

// Mount partner routes
router.use('/partner', partnerRoutes);

module.exports = router;
