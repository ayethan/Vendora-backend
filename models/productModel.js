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
  addons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  }],
  flavours: [{
    name: {
      type: String,
      required: true
    },
    extra_price: {
      type: Number,
      default: 0
    },
    is_default: {
      type: Boolean,
      default: false
    }
  }],
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
  position: {
    type: Number,
    required: false,
  },
}, { timestamps: true });

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;