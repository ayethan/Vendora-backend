const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const addressModel = require('../../models/addressModel');

class MemberAuthService {
  async signIn(email, password) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.role !== 'General') {
      throw new Error('Access denied. This is not a member account.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    return { user, token };
  }

  async signUp(userData) {
    const { name, email, password, phone, address, city, state, country, zip, latitude, longitude } = userData;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "General",
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
        coordinates: [longitude, latitude],
      },
      isDefault: true,
    });

    const savedAddress = await newAddress.save();

    savedUser.addresses.push(savedAddress._id);
    await savedUser.save();

    return savedUser;
  }
}

module.exports = new MemberAuthService();