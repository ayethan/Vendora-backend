const memberAuthService = require('../../services/memberAuthService');
const userService = require('../../services/admin/userService');
const partnerAuthService = require('../../services/partner/partnerAuthService');
const { check, validationResult } = require('express-validator');

// Validation rules for member signup
const validateMemberSignup = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Validation failed', error: true });
    }
    next();
  }
];

// Validation rules for member signin
const validateMemberSignin = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  check('password')
    .notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Validation failed', error: true });
    }
    next();
  }
];

const tokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
};

async function getMe(req, res) {
  try {
    const userPayload = req.user;
    const userId = userPayload.id || userPayload.userId;

    if (!userPayload.role) {
      return res.status(400).json({ message: 'Role not found in token.' });
    }

    let data;
    let message;

    switch (userPayload.role) {
      case 'Admin':
        data = await userService.getDetails(userId);
        message = 'Admin details fetched successfully';
        break;
      case 'Restaurant Owner':
        const partnerData = await partnerAuthService.getDetails(userId);
        data = partnerData; // Contains { user, restaurant }
        message = 'Partner details fetched successfully';
        break;
      case 'General':
        data = await memberAuthService.getDetails(userId);
        message = 'Member details fetched successfully';
        break;
      default:
        return res.status(403).json({ message: 'Unknown or unsupported user role.' });
    }

    res.status(200).json({
      message: message,
      data: data,
      success: true,
      error: false
    });

  } catch (error) {
    console.error('Error in getMe controller:', error);
    res.status(500).json({
      message: error.message || "Error fetching user details",
      error: true
    });
  }
}

async function getMemberDetails(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const user = await memberAuthService.getDetails(userId);
    res.status(200).json({
      message: 'Member details fetched successfully',
      data: user,
      success: true,
      error: false
    });
  } catch (error) {
    res.status(404).json({
      message: error.message || 'Internal server error',
      error: true
    });
  }
}

async function memberSignin(req, res, next) {
    const { email, password } = req.body;
    const { user, token } = await memberAuthService.signIn(email, password);

    res.cookie("member_token", token, tokenOptions).status(200).json({
      message: "Login successfully",
      token: token,
      data: user,
      success: true,
      error: false
    });
}

async function memberSignup(req, res, next) {
    const savedUser = await memberAuthService.signUp(req.body);

    res.status(201).json({
      data: savedUser,
      message: 'User registered successfully',
      error: false,
    });
}

async function memberSignout(req, res) {
  try {
    res.clearCookie("member_token", tokenOptions);
    res.json({
      message: "Member logout successfully",
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error during member sign out:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
    });
  }
}

module.exports = {
  getMe,
  getMemberDetails,
  memberSignin,
  memberSignup,
  memberSignout,
  validateMemberSignup,
  validateMemberSignin,
};