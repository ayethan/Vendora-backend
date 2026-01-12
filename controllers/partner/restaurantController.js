const restaurantModel = require('../../models/restaurantModel');
const mongoose = require('mongoose');

// Helper function to extract restaurantId from request
const getRestaurantId = (req) => {
    // partnerPermissionMiddleware already attaches the restaurant object to req.restaurant
    return req.restaurant ? req.restaurant._id : null;
};

// @desc    Get authenticated restaurant details
// @route   GET /api/partner/restaurant/details
// @access  Private (Restaurant Owner)
const getRestaurantDetails = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const restaurant = await restaurantModel.findById(restaurantId)
            .populate('shopCategory')
            .populate('cuisine');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found', success: false, error: true });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        console.error("Error in getRestaurantDetails:", error);
        res.status(500).json({ message: 'Error fetching restaurant details', success: false, error: true });
    }
};

// @desc    Update authenticated restaurant details (name, address, image etc.)
// @route   PUT /api/partner/restaurant/details
// @access  Private (Restaurant Owner)
const updateRestaurantDetails = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const updatedData = req.body;
        // Prevent changing owner or other sensitive fields
        delete updatedData.owner;
        delete updatedData.products;
        delete updatedData.status;
        delete updatedData.rating;

        const restaurant = await restaurantModel.findByIdAndUpdate(
            restaurantId,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found', success: false, error: true });
        }

        res.status(200).json({
            message: 'Restaurant details updated successfully',
            data: restaurant,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Error in updateRestaurantDetails:", error);
        res.status(500).json({ message: 'Internal server error', success: false, error: true });
    }
};

// @desc    Update authenticated restaurant schedule
// @route   PUT /api/partner/restaurant/schedule
// @access  Private (Restaurant Owner)
const updateRestaurantSchedule = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const { openingTimes } = req.body; // Expect an array of { day, open, close }

        const restaurant = await restaurantModel.findByIdAndUpdate(
            restaurantId,
            { openingTimes },
            { new: true, runValidators: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found', success: false, error: true });
        }

        res.status(200).json({
            message: 'Restaurant schedule updated successfully',
            data: restaurant.openingTimes,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Error in updateRestaurantSchedule:", error);
        res.status(500).json({ message: 'Internal server error', success: false, error: true });
    }
};

// @desc    Update authenticated restaurant delivery charges
// @route   PUT /api/partner/restaurant/delivery-charges
// @access  Private (Restaurant Owner)
const updateDeliveryCharges = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const { deliveryCharge } = req.body; // Expect a number

        if (typeof deliveryCharge !== 'number' || deliveryCharge < 0) {
            return res.status(400).json({ message: 'Invalid delivery charge provided', success: false, error: true });
        }

        const restaurant = await restaurantModel.findByIdAndUpdate(
            restaurantId,
            { deliveryCharge },
            { new: true, runValidators: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found', success: false, error: true });
        }

        res.status(200).json({
            message: 'Delivery charges updated successfully',
            data: restaurant.deliveryCharge,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Error in updateDeliveryCharges:", error);
        res.status(500).json({ message: 'Internal server error', success: false, error: true });
    }
};


module.exports = {
    getRestaurantDetails,
    updateRestaurantDetails,
    updateRestaurantSchedule,
    updateDeliveryCharges
};