const express = require('express')
const router = express.Router()

// middlewares
const authToken = require("../middleware/authToken");

// admin controllers
const authController = require("../controllers/admin/authController");
const userController = require("../controllers/admin/userController");
const productRouts = require('../controllers/admin/ProductController');

//frontend controllers
const frontendProduct = require('../controllers/frontendPages/ProductController');
const checkoutController = require('../controllers/frontendPages/checkoutController');
const cartController = require('../controllers/frontendPages/cartController');

// public routes
router.get("/product-list",frontendProduct.productList)
router.get("/product/:id", frontendProduct.getProductById)
router.get("/featured-products",frontendProduct.featuredProducts)
router.get("/product/related/:category/:productId", frontendProduct.getRelatedProducts)

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
router.get("/get-all-users",userController.getUserAll)
router.get("/user-details",authToken,userController.userDetails)
router.put("/update-user/:id",userController.updateUser)

router.get("/products",authToken,productRouts.getAllProducts)
router.post("/products-create",authToken, productRouts.createProduct)
router.get("/products/:id",authToken, productRouts.getProductById)
router.put("/products-update/:id",authToken, productRouts.updateProduct)
router.delete("/products-delete/:id",authToken, productRouts.deleteProduct)

module.exports = router
