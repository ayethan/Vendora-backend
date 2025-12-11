const shopCategoryModel = require('../../models/shopCategoryModel');
const mongodb = require('mongoose');

async function getAllShopCategories(req, res) {
  try {
    const categories = await shopCategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shop categories', success: false, error: true });
  }
}

async function createShopCategory(req, res) {
  try {
    const category = new shopCategoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shop category', success: false, error: true });
  }
}

async function getShopCategoryById(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await shopCategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Shop category not found', success: false, error: true });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shop category', success: false, error: true });
  }
}

async function updateShopCategory(req, res) {
  try {
    const categoryId = req.params.id;
    if (!mongodb.isValidObjectId(categoryId)) {
      return res.status(400).json({message: 'Invalid shop category ID', success: false, error: true});
    }
    const updatedData = req.body;
    const category = await shopCategoryModel.findByIdAndUpdate(categoryId, updatedData, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({message: 'Shop category not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'Shop category updated successfully',
      data: category,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }

}

async function deleteShopCategory(req, res) {
  try {
    const categoryId = req.params.id;
    if (!mongodb.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid shop category ID', success: false, error: true });
    }
    const category = await shopCategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({message: 'Shop category not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'Shop category deleted successfully',
      success: true,
      error: false
    });
    } catch (error) {
      res.status(500).json({message: 'Internal server error', success: false, error: true})
    }
  }


module.exports = {
  getAllShopCategories,
  createShopCategory,
  getShopCategoryById,
  updateShopCategory,
  deleteShopCategory
};