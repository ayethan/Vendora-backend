const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  // Check for specific role-based tokens first
  let token = req.cookies.admin_token || req.cookies.restaurant_token || req.cookies.member_token || req.cookies.driver_token;

  // If no specific role token found, try the generic 'token' for backward compatibility
  if (!token) {
      token = req.cookies.token;
  }

  // console.log("Auth Token Middleware - Token:", token); // Keep this commented or remove for production

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // This will catch any error from jwt.verify, including expiration or invalid signature
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authToken;
