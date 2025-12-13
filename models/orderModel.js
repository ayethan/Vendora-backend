const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: Number,
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: {
      address: String,
      city: String,
      country: String
    },
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'drivers'
  },
  paymentMethodId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true
});

const orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;
