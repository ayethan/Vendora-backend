const categoryModel = require('../../models/categoryModel')
const mongodb = require('mongoose');


async function getAllCategory(req, res) {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', success: false, error: true });
  }
}

async function createCategory(req, res) {
  try {
    const category = new categoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', success: false, error: true });
  }
}

async function getCategoryById(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'New RequestCategory not found', success: false, error: true });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', success: false, error: true });
  }
}

async function updateCategory(req, res) {
  try {
    const categoryId = req.params.id;
    if (!mongodb.isValidObjectId(categoryId)) {
      return res.status(400).json({message: 'Invalid category ID', success: false, error: true});
    }
    const updatedData = req.body;
    const category = await categoryModel.findByIdAndUpdate(categoryId, updatedData, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({message: 'Category not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }

}

async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id;
    if (!mongodb.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID', success: false, error: true });
    }
    const category = await categoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({message: 'Category not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'Category deleted successfully',
      success: true,
      error: false
    });
    } catch (error) {
      res.status(500).json({message: 'Internal server error', success: false, error: true})
    }
  }


module.exports = {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};