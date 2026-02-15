const restaurantModel = require('../../models/restaurantModel');
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

const getAllFrontendRestaurantsValidation = [
  check('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),
  check('lon').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),
  check('cuisine').optional().isMongoId().withMessage('Invalid cuisine ID'),
  validate
];

const createRestaurantValidation = [
  check('name').notEmpty().withMessage('Restaurant name is required').isString().withMessage('Restaurant name must be a string'),
  check('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a string'),
  check('address').notEmpty().withMessage('Address is required').isString().withMessage('Address must be a string'),
  check('phone').notEmpty().withMessage('Phone number is required').isString().withMessage('Phone number must be a string'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('cuisine').isMongoId().withMessage('Invalid cuisine ID'),
  check('location.type').equals('Point').withMessage('Location type must be Point'),
  check('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Location coordinates must be an array of 2 numbers'),
  check('location.coordinates.*').isFloat().withMessage('Location coordinates must be numbers'),
  check('deliveryInfo.minDeliveryTime').isInt({ gt: 0 }).withMessage('Minimum delivery time must be a positive integer'),
  check('deliveryInfo.maxDeliveryTime').isInt({ gt: 0 }).withMessage('Maximum delivery time must be a positive integer'),
  check('deliveryInfo.deliveryFee').isFloat({ min: 0 }).withMessage('Delivery fee must be a non-negative number'),
  validate
];

const getRestaurantByIdValidation = [
  check('id').isMongoId().withMessage('Invalid restaurant ID'),
  validate
];

const getFrontendRestaurantByIdValidation = [
  check('id').isMongoId().withMessage('Invalid restaurant ID'),
  validate
];

const getRestaurantBySlugValidation = [
  check('slug').notEmpty().withMessage('Restaurant slug is required').isString().withMessage('Slug must be a string'),
  validate
];

const updateRestaurantValidation = [
  check('id').isMongoId().withMessage('Invalid restaurant ID'),
  check('name').optional().notEmpty().withMessage('Restaurant name cannot be empty').isString().withMessage('Restaurant name must be a string'),
  check('description').optional().notEmpty().withMessage('Description cannot be empty').isString().withMessage('Description must be a string'),
  check('address').optional().notEmpty().withMessage('Address cannot be empty').isString().withMessage('Address must be a string'),
  check('phone').optional().notEmpty().withMessage('Phone number cannot be empty').isString().withMessage('Phone number must be a string'),
  check('email').optional().isEmail().withMessage('Valid email is required'),
  check('cuisine').optional().isMongoId().withMessage('Invalid cuisine ID'),
  check('location.type').optional().equals('Point').withMessage('Location type must be Point'),
  check('location.coordinates').optional().isArray({ min: 2, max: 2 }).withMessage('Location coordinates must be an array of 2 numbers'),
  check('location.coordinates.*').optional().isFloat().withMessage('Location coordinates must be numbers'),
  check('deliveryInfo.minDeliveryTime').optional().isInt({ gt: 0 }).withMessage('Minimum delivery time must be a positive integer'),
  check('deliveryInfo.maxDeliveryTime').optional().isInt({ gt: 0 }).withMessage('Maximum delivery time must be a positive integer'),
  check('deliveryInfo.deliveryFee').optional().isFloat({ min: 0 }).withMessage('Delivery fee must be a non-negative number'),
  validate
];

const deleteRestaurantValidation = [
  check('id').isMongoId().withMessage('Invalid restaurant ID'),
  validate
];
const deliveryInfoModel = require('../../models/deliveryInfoModel');
const categoryModel = require('../../models/categoryModel');
const cuisineModel = require('../../models/cuisineModel');


async function getAllRestaurants(req, res) {
  try {

    restaurants = await restaurantModel.find().populate('cuisine').populate('deliveryInfo');

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', success: false, error: true });
  }
}

async function getAllFrontendRestaurants(req, res) {
  try {

    const { lat, lon, category, cuisine } = req.query;

    let restaurants;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    let query = {};

    if (!isNaN(latitude) && !isNaN(longitude)) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 50000 // 50 kilometers
        }
      };
    }

    if (category) {
        // Find category by name
        const categoryDoc = await categoryModel.findOne({ name: category });

        if (categoryDoc) {
            // Find products with this category
            const products = await productModel.find({ category: categoryDoc._id });

            if (products.length > 0) {
                // Get unique restaurant IDs from the products
                const restaurantIds = [...new Set(products.filter(p => p.restaurant).map(p => p.restaurant.toString()))];
                query._id = { $in: restaurantIds.map(id => new mongodb.Types.ObjectId(id)) };
            } else {
                // No products in this category, so no restaurants to show
                return res.status(200).json([]);
            }
        } else {
            // No category found, so no restaurants to show
            return res.status(200).json([]);
        }
    }

    if (cuisine) {
        query.cuisine = new mongodb.Types.ObjectId(cuisine);
    }

    restaurants = await restaurantModel.find({ ...query, status: 'approved' }).populate('cuisine').populate('deliveryInfo');

    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Error fetching restaurants', success: false, error: true });
  }
}

async function createRestaurant(req, res) {
  try {
    const { deliveryInfo, ...restaurantData } = req.body;
    const newDeliveryInfo = new deliveryInfoModel(deliveryInfo);
    await newDeliveryInfo.save();

    const restaurant = new restaurantModel({
        ...restaurantData,
        deliveryInfo: newDeliveryInfo._id,
        owner: req.user._id
    });

    const generateSlug = (name) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      return slug;
    };
    restaurant.slug = generateSlug(restaurant.name);

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', success: false, error: true });
  }
}

async function getRestaurantById(req, res) {
  try {
    const restaurantId = req.params.id;
    const restaurant = await restaurantModel.findById(restaurantId).populate('deliveryInfo');
    if (!restaurant) {
      return res.status(404).json({ message: 'New Request restaurant not found', success: false, error: true });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', success: false, error: true });
  }
}

async function getFrontendRestaurantById(req, res) {
  try {
    const restaurantId = req.params.id;
    const restaurant = await restaurantModel.findById(restaurantId).populate('deliveryInfo');
    if (!restaurant) {
      return res.status(404).json({ message: 'New Request restaurant not found', success: false, error: true });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', success: false, error: true });
  }
}

async function getRestaurantBySlug(req, res) {
  try {
    const restaurantSlug = req.params.slug;
    const restaurant = await restaurantModel.findOne({ slug: restaurantSlug }).populate('cuisine').populate('deliveryInfo');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found', success: false, error: true });
    }
    const products = await productModel.find({ restaurant: restaurant._id }).populate('category').populate('flavours').populate('addons');
    const restaurantWithProducts = {
      ...restaurant.toObject(),
      products: products
    };
    res.status(200).json(restaurantWithProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', success: false, error: true });
  }
}

async function updateRestaurant(req, res) {
  try {
    const restaurantId = req.params.id;
    const { deliveryInfo, ...restaurantData } = req.body;
    const generateSlug = (name) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      return slug;
    };
    restaurantData.slug = generateSlug(restaurantData.name);

    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({message: 'restaurant not found', success: false, error: true});
    }

    if (restaurant.deliveryInfo) {
      await deliveryInfoModel.findByIdAndUpdate(restaurant.deliveryInfo, deliveryInfo);
    } else {
      const newDeliveryInfo = new deliveryInfoModel(deliveryInfo);
      await newDeliveryInfo.save();
      restaurantData.deliveryInfo = newDeliveryInfo._id;
    }

    const updatedRestaurant = await restaurantModel.findByIdAndUpdate(restaurantId, restaurantData, { new: true, runValidators: true });

    res.status(200).json({
      message: 'restaurant updated successfully',
      data: updatedRestaurant,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }

}

async function deleteRestaurant(req, res) {
  try {
    const restaurantId = req.params.id;
    const restaurant = await restaurantModel.findByIdAndDelete(restaurantId);
    if (!restaurant) {
      return res.status(404).json({message: 'restaurant not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'restaurant deleted successfully',
      success: true,
      error: false
    });
    } catch (error) {
      res.status(500).json({message: 'Internal server error', success: false, error: true})
    }
  }


module.exports = {
  getAllRestaurants,
  createRestaurant,
  createRestaurantValidation,
  getRestaurantById,
  getRestaurantByIdValidation,
  getFrontendRestaurantById,
  getFrontendRestaurantByIdValidation,
  getRestaurantBySlug,
  getRestaurantBySlugValidation,
  getAllFrontendRestaurants,
  getAllFrontendRestaurantsValidation,
  updateRestaurant,
  updateRestaurantValidation,
  deleteRestaurant,
  deleteRestaurantValidation
};