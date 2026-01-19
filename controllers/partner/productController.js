const productModel = require('../../models/productModel');
const categoryModel = require('../../models/categoryModel')
const mongoose = require('mongoose');

// Helper function to extract restaurantId from request
const getRestaurantId = (req) => {
    // partnerPermissionMiddleware already attaches the restaurant object to req.restaurant
    return req.restaurant ? req.restaurant._id : null;
};

const getProducts = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const products = await productModel.find({ restaurant: restaurantId })
            .populate('category')
            .populate('restaurant')
            .populate('addons')
            .populate('flavours');

        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getProducts:", error);
        res.status(500).json({ message: 'Error fetching products', success: false, error: true });
    }
};

const createProduct = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID not found in request', success: false, error: true });
        }

        const productData = req.body;
        // Ensure the restaurant ID from the authenticated session is used, overriding any in the body
        productData.restaurant = restaurantId;

        const product = new productModel(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error in createProduct:", error);
        res.status(500).json({ message: 'Error creating product', success: false, error: true, details: error.message });
    }
};

// @desc    Get a single product by ID for the authenticated restaurant
// @route   GET /api/partner/products/:id
// @access  Private (Restaurant Owner)
const getProductById = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        const productId = req.params.id;

        if (!restaurantId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid ID provided or Restaurant ID not found', success: false, error: true });
        }

        const product = await productModel.findOne({ _id: productId, restaurant: restaurantId })
            .populate('category')
            .populate('restaurant')
            .populate('addons')
            .populate('flavours');

        if (!product) {
            return res.status(404).json({ message: 'Product not found for this restaurant', success: false, error: true });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getProductById:", error);
        res.status(500).json({ message: 'Error fetching product', success: false, error: true });
    }
};

// @desc    Update a product by ID for the authenticated restaurant
// @route   PUT /api/partner/products/:id
// @access  Private (Restaurant Owner)
const updateProduct = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        const productId = req.params.id;

        if (!restaurantId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid ID provided or Restaurant ID not found', success: false, error: true });
        }

        const updatedData = req.body;
        // Prevent changing the restaurant of a product via update
        if (updatedData.restaurant) {
            delete updatedData.restaurant;
        }

        const product = await productModel.findOneAndUpdate(
            { _id: productId, restaurant: restaurantId }, // Ensure product belongs to the authenticated restaurant
            updatedData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found for this restaurant', success: false, error: true });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            data: product,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({ message: 'Internal server error', success: false, error: true });
    }
};

// @desc    Delete a product by ID for the authenticated restaurant
// @route   DELETE /api/partner/products/:id
// @access  Private (Restaurant Owner)
const deleteProduct = async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        const productId = req.params.id;

        if (!restaurantId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid ID provided or Restaurant ID not found', success: false, error: true });
        }

        const product = await productModel.findOneAndDelete({ _id: productId, restaurant: restaurantId }); // Ensure product belongs to the authenticated restaurant
        if (!product) {
            return res.status(404).json({ message: 'Product not found for this restaurant', success: false, error: true });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: 'Internal server error', success: false, error: true });
    }
};

async function getAllCategory(req, res) {
  // try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  // } catch (error) {
  //   res.status(500).json({ message: 'Error fetching categories', success: false, error: true });
  // }
}

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllCategory,
};