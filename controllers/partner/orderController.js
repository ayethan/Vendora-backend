const orderModel = require('../../models/orderModel');
const mongoose = require('mongoose');

// Helper function to extract restaurantId from request
const getRestaurantId = (req) => {
    // partnerPermissionMiddleware already attaches the restaurant object to req.restaurant
    return req.restaurant ? req.restaurant._id : null;
};


const getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const orders = await orderModel.find({ restaurant: restaurantId })
            .populate('userId')
            .populate('restaurant');

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error in getRestaurantOrders:", error);
        res.status(500).json({ message: 'Error fetching orders', success: false, error: true });
    }
};


const getOrderById = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        const orderId = req.params.id;

        if (!restaurantId || !mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({ message: 'Invalid Order ID or Restaurant ID not found', success: false, error: true });
        }

        const order = await orderModel.findOne({ _id: orderId, restaurant: restaurantId })
            .populate('user')
            .populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found for this restaurant', success: false, error: true });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error in getOrderById:", error);
        res.status(500).json({ message: 'Error fetching order', success: false, error: true });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        const orderId = req.params.id;
        const { status } = req.body; // Expected status: 'Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'

        if (!restaurantId || !mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({ message: 'Invalid Order ID or Restaurant ID not found', success: false, error: true });
        }
        if (!status) {
            return res.status(400).json({ message: 'Order status is required', success: false, error: true });
        }

        const validStatuses = ['Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}`, success: false, error: true });
        }

        const order = await orderModel.findOneAndUpdate(
            { _id: orderId, restaurant: restaurantId },
            { status: status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found for this restaurant', success: false, error: true });
        }

        res.status(200).json({
            message: `Order status updated to ${status}`,
            data: order,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: 'Internal server error', success: false, error: true });
    }
};

module.exports = {
    getRestaurantOrders,
    getOrderById,
    updateOrderStatus
};