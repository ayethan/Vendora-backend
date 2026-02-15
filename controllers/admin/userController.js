const userModel = require('../../models/userModel');
const userService = require('../../services/admin/userService');
const { check, validationResult } = require('express-validator');

// Helper function to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), success: false, error: true });
  }
  next();
};

const updateUserValidation = [
  check('id').isMongoId().withMessage('Invalid user ID'),
  check('name').optional().isString().withMessage('Name must be a string'),
  check('email').optional().isEmail().withMessage('Valid email is required'),
  check('role').optional().isString().withMessage('Role must be a string'), // Consider .isIn(['admin', 'member', 'partner'])
  check('address').optional().isString().withMessage('Address must be a string'),
  check('city').optional().isString().withMessage('City must be a string'),
  check('country').optional().isString().withMessage('Country must be a string'),
  check('phone').optional().isString().withMessage('Phone number must be a string'),
  validate
];

async function getAdminDetails(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const user = await userService.getDetails(userId);

    res.status(200).json({
      message: 'Admin details fetched successfully',
      data: user,
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(404).json({
      message: error.message || 'Internal server error',
      error: true
    });
  }
}

async function getUserAll(req, res) {
  try {
    const allUser = await userModel.find();
    res.status(200).json({
      data: allUser,
      success: 200,
      error: false,
      message:"successfully fetched all users",
    })
  } catch(error){
    console.error('Error during user sign in:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
     });
  }

}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, role, address, city, country, phone } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found'});
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      data: user,
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
}

module.exports = {
  getUserAll,
  getAdminDetails,
  updateUser,
  updateUserValidation
};