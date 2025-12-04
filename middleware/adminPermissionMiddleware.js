const permission = require('../helpers/adminPermission');

async function adminPermissionMiddleware(req, res, next) {
  try {
    const userId = req?.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false, error: true });
    }
    const isAdmin = await permission.adminPermission(userId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.', success: false, error: true });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Authorization check failed', success: false, error: true });
  }
}

module.exports = adminPermissionMiddleware;
