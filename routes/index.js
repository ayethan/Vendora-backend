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

//products
const productRouts = require('../controllers/product/ProductController');


// Routes"

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/signout",userSignoutController)
router.get("/get-all-users",getAllUsersController)
router.put("/update-user/:id",updateUserController)

router.get("/products",authToken,productRouts.getAllProducts)
router.post("/products-create",authToken, productRouts.createProduct)
router.get("/products/:id",authToken, productRouts.getProductById)
router.put("/products-update/:id",authToken, productRouts.updateProduct)
router.delete("/products-delete/:id",authToken, productRouts.deleteProduct)




module.exports = router
