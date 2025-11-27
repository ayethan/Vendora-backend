const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      role : "General",
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
