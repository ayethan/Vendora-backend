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
const adminBlogController = require('../controllers/admin/blogController');

// partner controllers
const partnerAuthController = require("../controllers/partner/authController");
router.post("/our-partner/signin", partnerAuthController.partnerSignIn);

// Import upload middleware
const upload = require('../middleware/upload');

//frontend controllers
const frontendProduct = require('../controllers/frontendPages/ProductController');
const checkoutController = require('../controllers/frontendPages/checkoutController');
const cartController = require('../controllers/frontendPages/cartController');
const { memberSignup, memberSignin, memberSignout, getMe, getMemberDetails, validateMemberSignup, validateMemberSignin } = require('../controllers/frontendPages/authController');
const frontendPageController = require('../controllers/frontendPages/homePageController');
const blogController = require('../controllers/frontendPages/blogController');
const restaurantSearchController = require('../controllers/frontendPages/restaurantSearchController');
// Import auth routes
const authRoutes = require('./authRoutes');
const partnerRoutes = require('./partnerRoutes');
const memberRoutes = require('./memberRoutes');

// public routes
router.get("/product-list",frontendProduct.productList)
router.get("/product/:id", frontendProduct.getProductById)
router.get("/featured-products",frontendProduct.featuredProducts)
router.get("/product/related/:category/:productId", frontendProduct.getRelatedProducts)
router.get("/search", frontendProduct.searchProduct)
router.get("/restaurants/search", restaurantSearchController.searchRestaurants);
router.get("/get-categories", frontendPageController.getAllCategory)
router.get("/page/:slug", frontendPageController.getPageBySlug)
router.get("/blog", blogController.getAllBlogPosts);
router.get("/blog/:slug", blogController.getBlogPostBySlug);

//cart
router.post("/cart/add", authToken, cartController.addToCart)
router.get("/cart", authToken, cartController.getCart)
router.put("/cart/update/:productId", authToken, cartController.updateCartItem)
router.delete("/cart/remove/:productId", authToken, cartController.removeCartItem)

// Checkout
router.post("/create-checkout-session", authToken, checkoutController.createCheckoutSession);

// --- Auth Routes ---
router.get("/me", authToken, getMe);
// Member
router.post("/signup", validateMemberSignup, memberSignup);
router.post("/signin", validateMemberSignin, memberSignin);
router.get("/signout", memberSignout);
router.get("/member/me", authToken, memberPermissionMiddleware, getMemberDetails);

// Admin
router.post("/admin/signin", authController.adminSignInValidation, authController.adminSignIn);
router.get("/admin/signout", authController.adminSignout);

// Restaurant
router.post("/partner/register", upload.single('restaurantImage'), authController.restaurantSignUpValidation, authController.restaurantSignUp);


// Mount social auth routes
router.use('/auth', authRoutes);

router.get("/restaurants/frontend", restaurantController.getAllFrontendRestaurantsValidation, restaurantController.getAllFrontendRestaurants);
router.get("/public/restaurants/:id", restaurantController.getFrontendRestaurantByIdValidation, restaurantController.getFrontendRestaurantById);
router.get("/restaurants/:slug", restaurantController.getRestaurantBySlugValidation, restaurantController.getRestaurantBySlug);

router.get("/cuisines/frontend", cuisineController.getAllCuisinesFrontend);


// --- Admin Routes ---
const adminRouter = express.Router();
adminRouter.use(authToken, adminPermissionMiddleware);

// self-details
adminRouter.get("/me", userController.getAdminDetails);

// user management
adminRouter.get("/get-all-users", userController.getUserAll);
adminRouter.put("/update-user/:id", userController.updateUserValidation, userController.updateUser);

//category
adminRouter.get("/categories", categoryController.getAllCategory);
adminRouter.post("/categories", categoryController.createCategoryValidation, categoryController.createCategory);
adminRouter.get("/categories/:id", categoryController.getCategoryByIdValidation, categoryController.getCategoryById);
adminRouter.put("/categories/:id", categoryController.updateCategoryValidation, categoryController.updateCategory);
adminRouter.delete("/categories/:id", categoryController.deleteCategoryValidation, categoryController.deleteCategory);
adminRouter.post("/categories/reorder", categoryController.reorderCategoriesValidation, categoryController.reorderCategories);

//cuisine
adminRouter.get("/cuisines", cuisineController.getAllCuisines);
adminRouter.post("/cuisines", cuisineController.createCuisineValidation, cuisineController.createCuisine);
adminRouter.get("/cuisines/:id", cuisineController.getCuisineByIdValidation, cuisineController.getCuisineById);
adminRouter.put("/cuisines/:id", cuisineController.updateCuisineValidation, cuisineController.updateCuisine);
adminRouter.delete("/cuisines/:id", cuisineController.deleteCuisineValidation, cuisineController.deleteCuisine);

//products
adminRouter.post("/products/update-popular-status", productRoutes.updatePopularStatusValidation, productRoutes.updatePopularStatus);
adminRouter.get("/restaurants/:restaurantId/products", productRoutes.getProductsByRestaurantValidation, productRoutes.getProductsByRestaurant);
adminRouter.post("/restaurants/:restaurantId/products", productRoutes.createProductValidation, productRoutes.createProduct);
adminRouter.get("/restaurants/:restaurantId/products/:id", productRoutes.getProductByIdValidation, productRoutes.getProductById);
adminRouter.put("/restaurants/:restaurantId/products/:id", productRoutes.updateProductValidation, productRoutes.updateProduct);
adminRouter.delete("/restaurants/:restaurantId/products/:id", productRoutes.deleteProductValidation, productRoutes.deleteProduct);

//shop category
adminRouter.get("/shop-categories", shopCategoryController.getAllShopCategories);
adminRouter.post("/shop-categories", shopCategoryController.createShopCategoryValidation, shopCategoryController.createShopCategory);
adminRouter.get("/shop-categories/:id", shopCategoryController.getShopCategoryByIdValidation, shopCategoryController.getShopCategoryById);
adminRouter.put("/shop-categories/:id", shopCategoryController.updateShopCategoryValidation, shopCategoryController.updateShopCategory);
adminRouter.delete("/shop-categories/:id", shopCategoryController.deleteShopCategoryValidation, shopCategoryController.deleteShopCategory);

//pages
adminRouter.get("/pages", pageController.getAllPages);
adminRouter.post("/pages", pageController.createPageValidation, pageController.createPage);
adminRouter.get("/pages/:id", pageController.getPageByIdValidation, pageController.getPageById);
adminRouter.put("/pages/:id", pageController.updatePageValidation, pageController.updatePage);
adminRouter.delete("/pages/:id", pageController.deletePageValidation, pageController.deletePage);

// Blog Management
adminRouter.get("/blogs", adminBlogController.getAllAdminBlogPosts);
adminRouter.post("/blogs", adminBlogController.createBlogPostValidation, adminBlogController.createBlogPost);
adminRouter.get("/blogs/:id", adminBlogController.getBlogPostByIdValidation, adminBlogController.getBlogPostById);
adminRouter.put("/blogs/:id", adminBlogController.updateBlogPostValidation, adminBlogController.updateBlogPost);
adminRouter.delete("/blogs/:id", adminBlogController.deleteBlogPostValidation, adminBlogController.deleteBlogPost);

//restaurants
adminRouter.get("/restaurants", restaurantController.getAllRestaurants);
adminRouter.post("/restaurants", restaurantController.createRestaurantValidation, restaurantController.createRestaurant);
adminRouter.get("/restaurants/:id", restaurantController.getRestaurantByIdValidation, restaurantController.getRestaurantById);
adminRouter.put("/restaurants/:id", restaurantController.updateRestaurantValidation, restaurantController.updateRestaurant);
adminRouter.delete("/restaurants/:id", restaurantController.deleteRestaurantValidation, restaurantController.deleteRestaurant);

// Mount the admin router into the main router
router.use('/admin', adminRouter);

// Mount partner routes
router.use('/partner', partnerRoutes);

// Mount member routes
router.use('/member', memberRoutes);

module.exports = router;
