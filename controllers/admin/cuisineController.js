const cuisineModel = require('../../models/cuisineModel');
const mongodb = require('mongoose');


async function getAllCuisines(req, res) {
  try {
    const cuisines = await cuisineModel.find();
    res.status(200).json(cuisines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cuisines', success: false, error: true });
  }
}

async function createCuisine(req, res) {
  try {
    const cuisine = new cuisineModel(req.body);
    console.log('cuisine',cuisine)
    await cuisine.save();
    res.status(201).json(cuisine);
  } catch (error) {
    console.log('Error creating cuisine:', error)
    res.status(500).json({ message: 'Error creating cuisine', success: false, error: true });
  }
}

async function getCuisineById(req, res) {
  try {
    const cuisineId = req.params.id;
    const cuisine = await cuisineModel.findById(cuisineId);
    if (!cuisine) {
      return res.status(404).json({ message: 'New RequestCuisine not found', success: false, error: true });
    }
    res.status(200).json(cuisine);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cuisine', success: false, error: true });
  }
}

async function updateCuisine(req, res) {
  try {
    const cuisineId = req.params.id;
    if (!mongodb.isValidObjectId(cuisineId)) {
      return res.status(400).json({message: 'Invalid cuisine ID', success: false, error: true});
    }
    const updatedData = req.body;
    const cuisine = await cuisineModel.findByIdAndUpdate(cuisineId, updatedData, { new: true, runValidators: true });
    if (!cuisine) {
      return res.status(404).json({message: 'Cuisine not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'Cuisine updated successfully',
      data: cuisine,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }

}

async function deleteCuisine(req, res) {
  try {
    const cuisineId = req.params.id;
    if (!mongodb.isValidObjectId(cuisineId)) {
      return res.status(400).json({ message: 'Invalid cuisine ID', success: false, error: true });
    }
    const cuisine = await cuisineModel.findByIdAndDelete(cuisineId);
    if (!cuisine) {
      return res.status(404).json({message: 'Cuisine not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'Cuisine deleted successfully',
      success: true,
      error: false
    });
    } catch (error) {
      res.status(500).json({message: 'Internal server error', success: false, error: true})
    }
  }


module.exports = {
  getAllCuisines,
  createCuisine,
  getCuisineById,
  updateCuisine,
  deleteCuisine
};