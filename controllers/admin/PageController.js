const pageModel = require('../../models/pageModel')
const mongodb = require('mongoose');


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
    const existingPage = await pageModel.findOne({ slug: req.body.slug });
    if (existingPage) {
      return res.status(400).json({ message: 'Page with the same slug already exists', success: false, error: true });
    }
    if (!page.title) {
      return res.status(400).json({ message: 'Title is required', success: false, error: true });
    }
    if (!page.content) {
      return res.status(400).json({ message: 'Content is required', success: false, error: true });
    }
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
    if (!mongodb.isValidObjectId(pageId)) {
      return res.status(400).json({message: 'Invalid page ID', success: false, error: true});
    }
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
    if (!mongodb.isValidObjectId(pageId)) {
      return res.status(400).json({ message: 'Invalid page ID', success: false, error: true });
    }
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
  getPageById,
  updatePage,
  deletePage
};