const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({
      data: newUser,
      message: 'User registered successfully',
      error: false,
    });
  } catch (error) {
    console.error('Error during user sign up:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
     });
  }
}

module.exports = userSignUpController;
