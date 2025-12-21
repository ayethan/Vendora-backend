const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  address: {
    type: String,
    required: [true, "Please provide an address"]
  },
  city: {
    type: String,
    required: [true, "Please provide a city"]
  },
  country: {
    type: String,
    required: [true, "Please provide a country"]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

addressSchema.index({ location: '2dsphere' });

const addressModel = mongoose.model('addresses', addressSchema);

module.exports = addressModel;
