const pageModel = require('../../models/pageModel');
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

async function getPageBySlug(req, res) {
  try {
    const { slug } = req.params;
    const page = await pageModel.findOne({ slug });
    if (!page) {
      return res.status(404).json({ message: 'Page not found', success: false, error: true });
    }
    res.status(200).json(page);
  } catch (error) {
    console.error("Error in getPageBySlug:", error);
    res.status(500).json({ message: 'Error fetching page by slug', success: false, error: true });
  }
}


module.exports = {
  getAllCategory,
  getPageBySlug
};