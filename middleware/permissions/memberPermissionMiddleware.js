const userModel = require('../../models/userModel');
async function memberPermissionMiddleware(req, res, next) {
  try {
    const userId = req?.user?.userId;
    const userRole = req?.user?.role;

    if (!userId || userRole !== 'General') {
      return res.status(403).json({ message: 'Access denied. Members only.', success: false, error: true });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false, error: true });
    }
    const user = await userModel.findById(userId);
    if (!user || user.role !== 'General') {
      return res.status(403).json({ message: 'Access denied. Members only.', success: false, error: true });
    }
    res.user = user;
    next();
  }
  catch (error) {
    res.status(500).json({ message: 'Authorization check failed', success: false, error: true });
  }
}
module.exports = memberPermissionMiddleware;