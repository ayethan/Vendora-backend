const categoryModel = require('../../models/categoryModel')
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


async function getAllCategory(req, res) {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', success: false, error: true });
  }
}

async function createCategory(req, res) {
  // Manual validation can be added here if needed before express-validator
  try {
    const category = new categoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', success: false, error: true });
  }
}

// Validation middleware for createCategory
const createCategoryValidation = [
  check('name').notEmpty().withMessage('Category name is required').isString().withMessage('Category name must be a string'),
  validate
];

// Validation middleware for updateCategory
const updateCategoryValidation = [
  check('id').isMongoId().withMessage('Invalid Category ID'),
  check('name').optional().notEmpty().withMessage('Category name cannot be empty').isString().withMessage('Category name must be a string'),
  validate
];

// Validation middleware for reorderCategories
const reorderCategoriesValidation = [
  check('categoryIds').isArray().withMessage('categoryIds must be an array'),
  check('categoryIds.*').isMongoId().withMessage('Each categoryId must be a valid Mongo ID'),
  validate
];

// Validation middleware for getCategoryById
const getCategoryByIdValidation = [
  check('id').isMongoId().withMessage('Invalid Category ID'),
  validate
];

// Validation middleware for deleteCategory
const deleteCategoryValidation = [
  check('id').isMongoId().withMessage('Invalid Category ID'),
  validate
];

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

async function reorderCategories(req, res) {
  try {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ message: 'categoryIds must be an array.', success: false, error: true });
    }

    const bulkOps = categoryIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));

    await categoryModel.bulkWrite(bulkOps);

    res.status(200).json({
      message: 'Categories reordered successfully',
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ message: 'Internal server error while reordering categories', success: false, error: true });
  }
}


module.exports = {
  getAllCategory,
  createCategory,
  createCategoryValidation,
  getCategoryById,
  getCategoryByIdValidation,
  updateCategory,
  updateCategoryValidation,
  deleteCategory,
  deleteCategoryValidation,
  reorderCategories,
  reorderCategoriesValidation
};