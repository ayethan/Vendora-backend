const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  // Add this line for debugging
  // console.log(`[AuthToken Middleware] Path: ${req.path}, Cookies:`, req.cookies);

  // Check for specific role-based tokens first based on path
  let token;
  const path = req.path;
  console.log("Auth Token Middleware - Path:", path);

  if (path.startsWith('/admin')) {
    token = req.cookies.admin_token;
  } else if (path.startsWith('/partner')) {
    token = req.cookies.restaurant_token;
  } else if (path.startsWith('/member')) {
    token = req.cookies.member_token;
  } else { // For generic routes like /me, /cart, etc., or other public routes that might need auth
    token = req.cookies.member_token || req.cookies.admin_token || req.cookies.restaurant_token || req.cookies.driver_token;
  }

  // If no specific role token found by path, fall back to the original order
  // This covers generic routes like /me, /cart etc.
  // This block is now integrated into the if/else-if/else above
  // if (!token) {
  //   token = req.cookies.admin_token || req.cookies.restaurant_token || req.cookies.member_token || req.cookies.driver_token;
  // }



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
    res.status(401).json({
       message: 'Invalid or expired token.',
       isexpired: true
    });
  }
}

module.exports = authToken;
