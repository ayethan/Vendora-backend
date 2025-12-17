const productModel = require('../../models/productModel');
const mongodb = require('mongoose');

async function getProductsByRestaurant(req, res) {
  try {
    const restaurantId = req.params.restaurantId;
    if (!mongodb.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID', success: false, error: true });
    }
    const products = await productModel.find({ restaurant: restaurantId }).populate('category').populate('restaurant');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products for restaurant', success: false, error: true });
  }
}

async function createProduct(req, res) {
  try {
    const restaurantId = req.params.restaurantId;
    if (!mongodb.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID', success: false, error: true });
    }

    const productData = req.body;
    // Ensure the restaurant ID from the URL is used, overriding any in the body
    productData.restaurant = restaurantId;

    const product = new productModel(productData);

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', success: false, error: true, details: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const { restaurantId, id: productId } = req.params;

    if (!mongodb.isValidObjectId(restaurantId) || !mongodb.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid ID provided', success: false, error: true });
    }

    const product = await productModel.findOne({ _id: productId, restaurant: restaurantId }).populate('category').populate('restaurant');
    if (!product) {
      return res.status(404).json({ message: 'Product not found for this restaurant', success: false, error: true });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', success: false, error: true });
  }
}

async function updateProduct(req, res) {
  try {
    const { restaurantId, id: productId } = req.params;

    if (!mongodb.isValidObjectId(restaurantId) || !mongodb.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid ID provided', success: false, error: true });
    }

    const updatedData = req.body;
    // Prevent changing the restaurant of a product via update
    if (updatedData.restaurant) {
      delete updatedData.restaurant;
    }

    const product = await productModel.findOneAndUpdate(
      { _id: productId, restaurant: restaurantId },
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
  }
   catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }
}

async function deleteProduct(req, res) {
  try {
    const { restaurantId, id: productId } = req.params;

    if (!mongodb.isValidObjectId(restaurantId) || !mongodb.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid ID provided', success: false, error: true });
    }

    const product = await productModel.findOneAndDelete({ _id: productId, restaurant: restaurantId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found for this restaurant', success: false, error: true });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }
}

module.exports = {
  getProductsByRestaurant,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};

