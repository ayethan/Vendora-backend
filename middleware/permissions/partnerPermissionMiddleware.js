const userModel = require('../../models/userModel');
const restaurantModel = require('../../models/restaurantModel');

async function partnerPermissionMiddleware(req, res, next) {
  try {
    const userId = req?.user?.userId;
    const userRole = req?.user?.role;

    if (!userId || userRole !== 'Restaurant Owner') {
      return res.status(403).json({ message: 'Access denied. Restaurant Owners only.', success: false, error: true });
    }

    const user = await userModel.findById(userId);
    if (!user || user.role !== 'Restaurant Owner') {
        return res.status(403).json({ message: 'Access denied. Invalid user or role.', success: false, error: true });
    }

    const restaurant = await restaurantModel.findOne({ owner: userId });
    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found for this owner.', success: false, error: true });
    }

    req.restaurant = restaurant;
    next();
  } catch (err) {
    console.error("Error in partnerPermissionMiddleware:", err);
    res.status(500).json({ message: 'Authorization check failed', success: false, error: true });
  }
}

module.exports = partnerPermissionMiddleware;
