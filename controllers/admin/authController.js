const adminAuthService = require('../../services/admin/adminAuthService');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Helper function to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), success: false, error: true });
  }
  next();
};

const adminSignInValidation = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required'),
  validate
];

const restaurantSignUpValidation = [
  check('name').notEmpty().withMessage('Restaurant name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('ownerName').notEmpty().withMessage('Owner name is required'),
  check('phone').notEmpty().withMessage('Phone number is required'),
  check('address').notEmpty().withMessage('Address is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('state').notEmpty().withMessage('State is required'),
  check('zip').notEmpty().withMessage('Zip code is required'),
  validate
];

const tokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
};

async function adminSignIn(req, res) {
  // try {
    const { email, password } = req.body;
    const { user, token } = await adminAuthService.signIn(email, password);

    res.cookie("admin_token", token, tokenOptions).status(200).json({
      message: "Admin login successfully",
      token: token,
      data: user,
      success: true,
      error: false
    });
  // } catch (error) {
  //   console.error('Error during admin sign in:', error);
  //   res.status(400).json({
  //     message: error.message || 'Internal server error',
  //     error: true
  //   });
  // }
}

async function restaurantSignUp(req, res) {
  try {
    const restaurantImage = req.file ? req.file.path : '';
    const { user, restaurant } = await adminAuthService.signUpRestaurant(req.body, restaurantImage);

    res.status(201).json({
      data: { user, restaurant },
      message: 'Restaurant registered successfully',
      error: false,
    });
  } catch (error) {
    console.error('Error during restaurant sign up:', error);
    res.status(400).json({
      message: error.message || 'Internal server error during restaurant registration',
      error: true,
    });
  }
}

async function adminSignout(req, res) {
  try {
    res.clearCookie("admin_token", tokenOptions);
    res.json({
      message: "Admin logout successfully",
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error during admin sign out:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
    });
  }
}

function googleAuthCallback(req, res) {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/signin?error=authentication_failed`);
  }

  const token = jwt.sign(
    { id: req.user.id, isAdmin: req.user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie("token", token, tokenOptions)
    .redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
}

module.exports = {
  adminSignIn,
  adminSignInValidation,
  adminSignout,
  googleAuthCallback,
  restaurantSignUp,
  restaurantSignUpValidation
};