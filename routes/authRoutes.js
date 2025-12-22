const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/admin/authController');

// --- Social Auth Routes (Public) ---

// #1. Initiate Google OAuth login
// This route redirects the user to Google's login page.
router.get('/google',
    passport.authenticate('google', { 
        scope: [
            'profile', 
            'email',
            'https://www.googleapis.com/auth/user.addresses.read' // Request address scope
        ] 
    })
);

// #2. Google OAuth callback URL
// Google redirects to this URL after the user authenticates.
router.get('/google/callback',
    // Passport middleware handles the code-for-token exchange.
    // We use `session: false` because we are using JWTs, not server sessions.
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    // If authentication is successful, the `googleAuthCallback` controller function is called.
    authController.googleAuthCallback
);

module.exports = router;
