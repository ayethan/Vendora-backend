const pageModel = require('../../models/pageModel')
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

const createPageValidation = [
  check('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
  check('content').notEmpty().withMessage('Content is required').isString().withMessage('Content must be a string'),
  check('slug').optional().isString().withMessage('Slug must be a string')
    .custom(async (slug, { req }) => {
      if (slug) {
        const existingPage = await pageModel.findOne({ slug });
        if (existingPage) {
          throw new Error('Page with the same slug already exists');
        }
      }
    }),
  validate
];

const getPageByIdValidation = [
  check('id').isMongoId().withMessage('Invalid page ID'),
  validate
];

const updatePageValidation = [
  check('id').isMongoId().withMessage('Invalid page ID'),
  check('title').optional().notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
  check('content').optional().notEmpty().withMessage('Content cannot be empty').isString().withMessage('Content must be a string'),
  check('slug').optional().isString().withMessage('Slug must be a string')
    .custom(async (slug, { req }) => {
      if (slug) {
        const existingPage = await pageModel.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingPage) {
          throw new Error('Page with the same slug already exists');
        }
      }
    }),
  validate
];

const deletePageValidation = [
  check('id').isMongoId().withMessage('Invalid page ID'),
  validate
];


async function getAllPages(req, res) {
  try {
    const pages = await pageModel.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages', success: false, error: true });
  }
}

async function createPage(req, res) {
  try {
    const page = new pageModel(req.body);
    const generateSlug = (title) => {
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      return slug;
    };
    page.slug = generateSlug(page.title);

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error creating page', success: false, error: true });
  }
}

async function getPageById(req, res) {
  try {
    const pageId = req.params.id;
    const page = await pageModel.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: 'New Request page not found', success: false, error: true });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page', success: false, error: true });
  }
}

async function updatePage(req, res) {
  try {
    const pageId = req.params.id;
    const updatedData = req.body;
    const page = await pageModel.findByIdAndUpdate(pageId, updatedData, { new: true, runValidators: true });
    if (!page) {
      return res.status(404).json({message: 'page not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'page updated successfully',
      data: page,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }

}

async function deletePage(req, res) {
  try {
    const pageId = req.params.id;
    const page = await pageModel.findByIdAndDelete(pageId);
    if (!page) {
      return res.status(404).json({message: 'page not found', success: false, error: true});
    }
    res.status(200).json({
      message: 'page deleted successfully',
      success: true,
      error: false
    });
    } catch (error) {
      res.status(500).json({message: 'Internal server error', success: false, error: true})
    }
  }


module.exports = {
  getAllPages,
  createPage,
  createPageValidation,
  getPageById,
  getPageByIdValidation,
  updatePage,
  updatePageValidation,
  deletePage,
  deletePageValidation
};