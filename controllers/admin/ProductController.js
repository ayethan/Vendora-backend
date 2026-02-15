const productModel = require('../../models/productModel');
const mongodb = require('mongoose');
const { check, validationResult } = require('express-validator');

// Helper function to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), success: false, error: true });
  }
  next();
};

const getProductsByRestaurantValidation = [
  check('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  validate
];

const createProductValidation = [
  check('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  check('name').notEmpty().withMessage('Product name is required').isString().withMessage('Product name must be a string'),
  check('description').optional().isString().withMessage('Description must be a string'),
  check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  check('category').isMongoId().withMessage('Invalid category ID'),
  check('addons').optional().isArray().withMessage('Addons must be an array of IDs'),
  check('addons.*').isMongoId().withMessage('Each addon must be a valid Mongo ID'),
  check('flavours').optional().isArray().withMessage('Flavours must be an array of IDs'),
  check('flavours.*').isMongoId().withMessage('Each flavour must be a valid Mongo ID'),
  check('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean'),
  validate
];

const getProductByIdValidation = [
  check('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  check('id').isMongoId().withMessage('Invalid product ID'),
  validate
];

const updateProductValidation = [
  check('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  check('id').isMongoId().withMessage('Invalid product ID'),
  check('name').optional().notEmpty().withMessage('Product name cannot be empty').isString().withMessage('Product name must be a string'),
  check('description').optional().isString().withMessage('Description must be a string'),
  check('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  check('category').optional().isMongoId().withMessage('Invalid category ID'),
  check('addons').optional().isArray().withMessage('Addons must be an array of IDs'),
  check('addons.*').optional().isMongoId().withMessage('Each addon must be a valid Mongo ID'),
  check('flavours').optional().isArray().withMessage('Flavours must be an array of IDs'),
  check('flavours.*').optional().isMongoId().withMessage('Each flavour must be a valid Mongo ID'),
  check('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean'),
  validate
];

const deleteProductValidation = [
  check('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  check('id').isMongoId().withMessage('Invalid product ID'),
  validate
];

const updatePopularStatusValidation = [
  check('products').isArray().withMessage('Products must be an array'),
  check('products.*.id').isMongoId().withMessage('Each product ID must be a valid Mongo ID'),
  check('products.*.isPopular').isBoolean().withMessage('isPopular must be a boolean'),
  validate
];

async function getProductsByRestaurant(req, res) {
  try {
    const restaurantId = req.params.restaurantId;
    const products = await productModel.find({ restaurant: restaurantId }).populate('category').populate('restaurant').populate('addons').populate('flavours');
    console.log(products)
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products for restaurant', success: false, error: true });
  }
}

async function createProduct(req, res) {
  try {
    const restaurantId = req.params.restaurantId;
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

    const product = await productModel.findOne({ _id: productId, restaurant: restaurantId }).populate('category').populate('restaurant').populate('addons');
        console.log('products',product)

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

async function updatePopularStatus(req, res) {
  try {
    const { products } = req.body;

    const bulkOps = products.map(product => ({
      updateOne: {
        filter: { _id: product.id },
        update: { $set: { isPopular: product.isPopular } },
      },
    }));

    await productModel.bulkWrite(bulkOps);

    res.status(200).json({
      message: 'Popular status updated successfully',
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Update popular status error:', error);
    res.status(500).json({ message: 'Internal server error while updating popular status', success: false, error: true });
  }
}

module.exports = {
  getProductsByRestaurant,
  getProductsByRestaurantValidation,
  createProduct,
  createProductValidation,
  getProductById,
  getProductByIdValidation,
  updateProduct,
  updateProductValidation,
  deleteProduct,
  deleteProductValidation,
  updatePopularStatus,
  updatePopularStatusValidation
};

