const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  const token = req.cookies.token;
  console.log("Auth Token Middleware - Token:", token);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Call next() after successfully verifying the token
  } catch (error) {
    // This will catch any error from jwt.verify, including expiration or invalid signature
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authToken;
