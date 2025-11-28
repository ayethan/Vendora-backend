const permission = require('../../helpers/adminPermission');
const productModel = require('../../models/productModel');
const mongodb = require('mongoose');


async function ensureAdmin(req, res) {
  try {
    const userId = req?.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized', success: false, error: true });
      return null;
    }
    const isAdmin = await permission.adminPermission(userId);
    if (!isAdmin) {
      res.status(403).json({ message: 'Access denied. Admins only.', success: false, error: true });
      return null;
    }
    return userId;
  } catch (err) {
    res.status(500).json({ message: 'Authorization check failed', success: false, error: true });
    return null;
  }
}

async function getAllProducts(req, res) {
  try {
    const userId = await ensureAdmin(req, res);
    if (!userId) return;

    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', success: false, error: true });
  }
}

async function createProduct(req, res) {
  try {
    const userId = await ensureAdmin(req, res);
    if (!userId) return;

    const product = new productModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', success: false, error: true });
  }
}


async function getProductById(req, res) {
  try {
    const userId = await ensureAdmin(req, res);
    if (!userId) return;

    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false, error: true });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', success: false, error: true });
  }
}

async function updateProduct(req, res) {
  try {
    const userId = await ensureAdmin(req, res);
    if (!userId) return;

    const productId = req.params.id;
    if (!mongodb.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID', success: false, error: true });
    }

    const updatedData = req.body;
    const product = await productModel.findByIdAndUpdate(productId, updatedData, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false, error: true });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      data: product,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }
}

async function deleteProduct(req, res) {
  try {
    const userId = await ensureAdmin(req, res);
    if (!userId) return;

    const productId = req.params.id;
    if (!mongodb.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID', success: false, error: true });
    }

    const product = await productModel.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false, error: true });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', success: false, error: true });
  }
}


module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};

