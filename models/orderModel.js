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
      price: Number, // Price at the time of order
    },
  ],
  subtotal: { // New field
    type: Number,
    required: true,
  },
  deliveryFee: { // New field
    type: Number,
    required: true,
  },
  taxAmount: { // New field
    type: Number,
    default: 0,
  },
  discountAmount: { // New field
    type: Number,
    default: 0,
  },
  totalAmount: { // Renamed from 'amount'
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
  deliveryMethod: { // New field
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'drivers'
  },
  paymentTransactionId: { // Renamed from 'paymentMethodId'
    type: String,
    required: false, // Not required for COD
  },
  paymentStatus: { // New field, separated from general status
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    required: true,
  },
  status: { // Updated enum for main order status
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
    required: true,
  },
  // New status timestamps
  acceptedAt: {
    type: Date,
  },
  preparedAt: {
    type: Date,
  },
  pickedUpAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
}, {
  timestamps: true
});

const orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;
