const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name : String,
  email : {
    type: String,
    unique: true,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents to have no googleId
  },
  phone: String,
  password : String,
  profilePic : String,
  role : {
    type : String,
    enum : ["General", "Admin", "Restaurant Owner", "Delivery Rider"],
    default : "General",
    required : true
  },
  isVerified : Boolean,
  addresses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'addresses'
  }]
}, { 
  timestamps: true,
  // Enable virtuals to be included in toJSON and toObject outputs
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for isAdmin
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'Admin';
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;