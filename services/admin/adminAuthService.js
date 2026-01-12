const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const addressModel = require('../../models/addressModel');
const restaurantModel = require('../../models/restaurantModel');

class AdminAuthService {
  async signIn(email, password) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.role !== 'Admin') {
      throw new Error('Access denied. Not an admin account.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    return { user, token };
  }

  async signUpRestaurant(restaurantData, restaurantImage) {
    const {
      name,
      email,
      password,
      phone,
      restaurantName,
      restaurantDescription,
      cuisine,
      restaurantType,
      address,
      city,
      state,
      country,
      zip,
      latitude,
      longitude,
    } = restaurantData;

    if (!name || !email || !password || !phone || !restaurantName || !restaurantDescription || !cuisine || !restaurantType || !address || !city || !state || !country || !zip || !latitude || !longitude) {
      throw new Error('All required fields must be provided.');
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const existingRestaurant = await restaurantModel.findOne({ name: restaurantName });
    if (existingRestaurant) {
      throw new Error('A restaurant with this name already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "Restaurant Owner",
      isVerified: false,
    });
    const savedUser = await newUser.save();

    const newAddress = new addressModel({
      user: savedUser._id,
      address,
      city,
      country,
      state,
      zip,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      isDefault: true,
    });
    const savedAddress = await newAddress.save();

    const newRestaurant = new restaurantModel({
      name: restaurantName,
      slug: restaurantName.toLowerCase().replace(/\s+/g, '-'),
      description: restaurantDescription,
      address: savedAddress._id,
      city: city,
      country: country,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      type: restaurantType,
      cuisine: cuisine,
      image: restaurantImage,
      owner: savedUser._id,
    });
    const savedRestaurant = await newRestaurant.save();

    savedUser.addresses.push(savedAddress._id);
    savedUser.restaurant = savedRestaurant._id;
    await savedUser.save();

    return { user: savedUser, restaurant: savedRestaurant };
  }
}

module.exports = new AdminAuthService();