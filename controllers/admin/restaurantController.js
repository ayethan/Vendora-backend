const restaurantModel = require('../../models/restaurantModel');
const productModel = require('../../models/productModel');
const mongodb = require('mongoose');
const deliveryInfoModel = require('../../models/deliveryInfoModel');


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

    const { lat, lon } = req.query;

    let restaurants;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);


    if (!isNaN(latitude) && !isNaN(longitude)) {
      restaurants = await restaurantModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: 50000 // 50 kilometers
          }
        }
      }).populate('cuisine').populate('deliveryInfo');
    }
    // else {
    //   restaurants = await restaurantModel.find().populate('cuisine').populate('deliveryInfo');
    // }

    res.status(200).json(restaurants);
  } catch (error) {
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
    const products = await productModel.find({ restaurant: restaurant._id }).populate('category');
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
    if (!mongodb.isValidObjectId(restaurantId)) {
      return res.status(400).json({message: 'Invalid restaurant ID', success: false, error: true});
    }
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