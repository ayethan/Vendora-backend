const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken'); // Assuming this is the auth middleware
const memberController = require('../controllers/member/memberController');

// Protect all member routes
router.use(authToken);

// Profile routes
router.get('/profile', memberController.getProfile);
router.put('/profile', memberController.updateProfile);

// Address routes
router.get('/addresses', memberController.getAddresses);
router.post('/addresses', memberController.addAddress);
router.put('/addresses/:id', memberController.updateAddress);
router.delete('/addresses/:id', memberController.deleteAddress);

// Order routes
router.get('/orders', memberController.getOrders);

// Wishlist routes
router.get('/wishlist', memberController.getWishlist);
router.post('/wishlist/restaurant', memberController.addRestaurantToWishlist);
router.delete('/wishlist/restaurant/:restaurantId', memberController.removeRestaurantFromWishlist);

module.exports = router;
