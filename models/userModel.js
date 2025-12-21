const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name : String,
  email : {
    type: String,
    unique: true,
    required: true
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
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;