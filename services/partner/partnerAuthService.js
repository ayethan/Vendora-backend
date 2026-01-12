const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const restaurantModel = require('../../models/restaurantModel');

class PartnerAuthService {
  async signIn(email, password) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (user.role !== 'Restaurant Owner') {
      throw new Error('Access denied. You are not a Restaurant Owner.');
    }

    const restaurant = await restaurantModel.findOne({ owner: user._id });
    if (!restaurant) {
      throw new Error('Restaurant not found for this user.');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, restaurantId: restaurant._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, restaurant, token };
  }

  async getDetails(userId) {
    if (!userId) {
      throw new Error('User ID must be provided.');
    }
    const user = await userModel.findById(userId).populate('addresses');
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.role !== 'Restaurant Owner') {
        throw new Error('User is not a Restaurant Owner.');
    }

    const restaurant = await restaurantModel.findOne({ owner: user._id }).populate('cuisine').populate('deliveryInfo');
    if (!restaurant) {
        throw new Error('Restaurant not found for this user.');
    }

    return { user, restaurant };
  }
}

module.exports = new PartnerAuthService();