const mongodb = require('mongoose');

const userSchema = new mongodb.Schema({
  name : String,
  email : {
    type: String,
    unique: true,
    required: true
  },
  password : String,
  profilePic : String,
  role : String,
  isVerified : Boolean,
}, { timestamps: true });

const User = mongodb.model('User', userSchema);

module.exports = User;