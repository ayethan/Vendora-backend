const userModel = require('../../models/userModel');
const addressModel = require('../../models/addressModel');
const orderModel = require('../../models/orderModel');
const mongoose = require('mongoose');

// @desc    Get member profile
// @route   GET /api/member/profile
// @access  Private (Member)
exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password -googleId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update member profile
// @route   PUT /api/member/profile
// @access  Private (Member)
exports.updateProfile = async (req, res) => {
  const { name, email, phone, profilePic } = req.body;
  try { // Uncommented try block
    const user = await userModel.findById(req.user.userId);
    console.log('Updating profile for user ID:', req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.profilePic = profilePic || user.profilePic;

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error. Please check server logs for details.' });
  }
};

// @desc    Get all addresses for a member
// @route   GET /api/member/addresses
// @access  Private (Member)
exports.getAddresses = async (req, res) => {
  console.log('Fetching addresses for user ID:', req.user.userId);
  try {
    const addresses = await addressModel.find({ user: req.user.userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Add a new address for a member
// @route   POST /api/member/addresses
// @access  Private (Member)
exports.addAddress = async (req, res) => {
  const { address, city, country, latitude, longitude, isDefault } = req.body;
  console.log('Adding address for user ID:', latitude, longitude, req.body);
  try {
    if (longitude == null || latitude == null) {
        return res.status(400).json({ success: false, message: 'Invalid location. Please select a valid address from the suggestions.' });
    }
    console.log('Adding address for user ID:', req.user.userId);
    const newAddress = new addressModel({
      user: req.user.userId,
      address,
      city,
      country,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      isDefault: false,
    });
    await newAddress.save();
    res.status(201).json({ success: true, message: 'Address added successfully.', address: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ success: false, message: 'Server error. Please check server logs for details.' });
  }
};

// @desc    Update an existing address for a member
// @route   PUT /api/member/addresses/:id
// @access  Private (Member)
exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address, city, country, latitude, longitude, isDefault } = req.body;

  // Validate address ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid address ID.' });
  }

  try {
    const updatedFields = {
      address,
      city,
      country,
      isDefault,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };

    const updatedAddress = await addressModel.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: 'Address not found or not authorized.' });
    }
    res.status(200).json({ success: true, message: 'Address updated successfully.', address: updatedAddress });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: 'Server error. Please check server logs for details.' });
  }
};

// @desc    Delete an address for a member
// @route   DELETE /api/member/addresses/:id
// @access  Private (Member)
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  // Validate address ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid address ID.' });
  }

  try {
    const deletedAddress = await addressModel.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deletedAddress) {
      return res.status(404).json({ success: false, message: 'Address not found or not authorized.' });
    }
    res.status(200).json({ success: true, message: 'Address deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get all orders for a member
// @route   GET /api/member/orders
// @access  Private (Member)
exports.getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id })
      .populate('restaurant', 'name')
      .select('-paymentMethodId');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
