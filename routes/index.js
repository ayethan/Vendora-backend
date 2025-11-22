const express = require('express')

const router = express.Router()

// middlewares
const authToken = require("../middleware/authToken");

// controllers
const userSignUpController = require("../controllers/user/userSignUp");
const userSignInController = require("../controllers/user/userSignIn");
const userDetailsController = require("../controllers/user/userDetails");

// Routes"

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)

module.exports = router
