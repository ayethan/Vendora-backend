const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');
const partnerPermissionMiddleware = require('../middleware/permissions/partnerPermissionMiddleware');
const productController = require('../controllers/partner/productController');
const restaurantController = require('../controllers/partner/restaurantController');
const orderController = require('../controllers/partner/orderController');
const partnerAuthController = require('../controllers/partner/authController');

// All partner routes will use authToken and partnerPermissionMiddleware
router.use(authToken);
router.use(partnerPermissionMiddleware);

// Auth routes
router.get('/me', partnerAuthController.getPartnerDetails);
router.get('/signout', partnerAuthController.partnerSignOut);

// Product Management Routes
router.route('/products')
    .get(productController.getProducts)
    .post(productController.createProduct);

router.route('/products/:id')
    .get(productController.getProductById)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

// Restaurant Management Routes
router.route('/restaurant/details')
    .get(restaurantController.getRestaurantDetails)
    .put(restaurantController.updateRestaurantDetails);

router.route('/restaurant/schedule')
    .put(restaurantController.updateRestaurantSchedule);

router.route('/restaurant/delivery-charges')
    .put(restaurantController.updateDeliveryCharges);

// Order Management Routes
router.route('/orders')
    .get(orderController.getRestaurantOrders);

router.route('/orders/:id')
    .get(orderController.getOrderById);

router.route('/orders/:id/status')
    .put(orderController.updateOrderStatus);

module.exports = router;
