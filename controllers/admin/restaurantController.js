const restaurantModel = require('../../models/restaurantModel');
const productModel = require('../../models/productModel');
const mongodb = require('mongoose');


async function getAllRestaurants(req, res) {
  try {
    const restaurants = await restaurantModel.find().populate('cuisine');
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', success: false, error: true });
  }
}

async function getAllFrontendRestaurants(req, res) {
  try {
    const restaurants = await restaurantModel.find().populate('cuisine');
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', success: false, error: true });
  }
}

async function createRestaurant(req, res) {
  try {
    const restaurant = new restaurantModel({
        ...req.body,
        owner: req.user._id
    });

    if (!restaurant.name) {
      return res.status(400).json({ message: 'Name is required', success: false, error: true });
    }
    if (!restaurant.description) {
      return res.status(400).json({ message: 'Description is required', success: false, error: true });
    }
    const generateSlug = (name) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      return slug;
    };
    restaurant.slug = generateSlug(restaurant.name);

    console.log(restaurant)
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', success: false, error: true });
  }
}

async function getRestaurantById(req, res) {
  try {
    const restaurantId = req.params.id;
    const restaurant = await restaurantModel.findById(restaurantId);
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
    console.log('slug',restaurantSlug)
    const restaurant = await restaurantModel.find({ slug: restaurantSlug }).populate('cuisine');
    const products = await productModel.find({ restaurant: restaurant._id }).populate('category');
    if (!products) {
      return res.status(404).json({ message: 'New Request restaurant not found', success: false, error: true });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', success: false, error: true });
  }
}

async function updateRestaurant(req, res) {
  try {
    const restaurantId = req.params.id;
    if (!mongodb.isValidObjectId(restaurantId)) {
      return res.status(400).json({message: 'Invalid restaurant ID', success: false, error: true});
    }
    const updatedData = req.body;
    const generateSlug = (name) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      return slug;
    };
    updatedData.slug = generateSlug(updatedData.name);
    const restaurant = await restaurantModel.findByIdAndUpdate(restaurantId, updatedData, { new: true, runValidators: true });
    if (!restaurant) {
      return res.status(404).json({message: 'restaurant not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'restaurant updated successfully',
      data: restaurant,
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
    if (!mongodb.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID', success: false, error: true });
    }
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
  getRestaurantById,
  getRestaurantBySlug,
  getAllFrontendRestaurants,
  updateRestaurant,
  deleteRestaurant
};