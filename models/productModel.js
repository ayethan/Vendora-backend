const mongodb = require('mongoose');

const productSchema = new mongodb.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: false,
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
    type: Number,
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

const Product = mongodb.model('Product', productSchema);

module.exports = Product;