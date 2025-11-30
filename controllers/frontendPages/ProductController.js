const productModel = require('../../models/productModel');

async function productList(req, res) {
  try {
    const page = parseInt(req.query.page) ||1;
    const limit = parseInt(req.query.limit) || 9;
    const {category,brand, search,sort} = req.query;

    let filter = {};
    if(category) {
      filter.category = {'$in': category.split(',').map(id => parseInt(id, 10))};
    }
    if(brand) {
      filter.brand = {'$in': brand.split(',')};
    }
    if(search) {
      filter.$or = [
        {name: {$regex: search, $options: 'i'}},
        {description: {$regex: search, $options: 'i'}}
      ];
    }

    let sortOption = {};
    switch(sort) {
      case 'old-to-new':
        sortOption = {createdAt: 1, _id: 1};
        break;
      case 'price-low-to-high':
        sortOption = {selling_price: 1, _id: 1};
        break;
      case 'price-high-to-low':
        sortOption = {selling_price: -1, _id: -1};
        break;
      case 'new-to-old':
      default:
        sortOption = {createdAt: -1, _id: -1};
        break;
    }


    const products = await productModel.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalProducts = await productModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      totalProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products', success: false, error: true });
  }
}

async function featuredProducts(req, res) {
  try {
    const products = await productModel.find().limit(8).exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', success: false, error: true });
  }
}

async function getProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId).exec();
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false, error: true });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product', success: false, error: true });
  }
}

module.exports = {
  productList,
  featuredProducts,
  getProductById,
};