const express = require('express')

const router = express.Router()

// middlewares
const authToken = require("../middleware/authToken");

// controllers
const userSignUpController = require("../controllers/user/userSignUp");
const userSignInController = require("../controllers/user/userSignIn");
const userDetailsController = require("../controllers/user/userDetails");
const userSignoutController = require('../controllers/user/userSignout');
const getAllUsersController = require('../controllers/user/getAllUsers');
const updateUserController = require('../controllers/user/updateUser');
const checkoutController = require('../controllers/checkoutController');


//products
const productRouts = require('../controllers/product/ProductController');
const cartController = require('../controllers/cart/cartController');

//frontend pages
const frontendProduct = require('../controllers/frontendPages/ProductController');


// Routes"

// public routes
router.get("/product-list",frontendProduct.productList)
router.get("/product/:id", frontendProduct.getProductById)
router.get("/featured-products",frontendProduct.featuredProducts)
router.get("/product/related/:category/:productId", frontendProduct.getRelatedProducts)

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)


// admin routes
router.get("/user-details",authToken,userDetailsController)
router.get("/signout",userSignoutController)
router.get("/get-all-users",getAllUsersController)
router.put("/update-user/:id",updateUserController)

router.get("/products",authToken,productRouts.getAllProducts)
router.post("/products-create",authToken, productRouts.createProduct)
router.get("/products/:id",authToken, productRouts.getProductById)
router.put("/products-update/:id",authToken, productRouts.updateProduct)
router.delete("/products-delete/:id",authToken, productRouts.deleteProduct)

//cart
router.post("/cart/add", authToken, cartController.addToCart)
router.get("/cart", authToken, cartController.getCart)
router.put("/cart/update/:productId", authToken, cartController.updateCartItem)
router.delete("/cart/remove/:productId", authToken, cartController.removeCartItem)

// Checkout
router.post("/create-checkout-session", authToken, checkoutController.createCheckoutSession);




module.exports = router
