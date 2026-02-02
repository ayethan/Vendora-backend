const categoryModel = require('../../models/categoryModel');
const mongodb = require('mongoose');

async function getAllCategory(req, res) {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getAllCategory:", error);
    res.status(500).json({ message: 'Error fetching categories', success: false, error: true });
  }
}

module.exports = {
  getAllCategory
};