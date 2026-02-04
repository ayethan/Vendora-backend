const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    flavour: {
      type: String, // Store the selected flavour as a string
    },
    addons: [{ // Store selected addons with their details
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products.addons', // Reference to the addon within the product schema
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
    }],
  }],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
