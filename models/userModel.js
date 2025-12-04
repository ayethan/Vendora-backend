const mongodb = require('mongoose');

const userSchema = new mongodb.Schema({
  name : String,
  email : {
    type: String,
    unique: true,
    required: true
  },
  phone: String,
  password : String,
  profilePic : String,
  role : String,
  isVerified : Boolean,
  address: String,
  city: String,
  country: String,
}, { timestamps: true });

const User = mongodb.model('User', userSchema);

module.exports = User;