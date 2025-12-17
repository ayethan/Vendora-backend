const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true
  },
  featured_image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  selling_price: {
    type: Number,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  image: [],
  stock: {
    type: Number,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;