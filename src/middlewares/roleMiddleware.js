// Check if user has required role
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. This action requires ${allowedRoles.join(' or ')} role.`,
        yourRole: userRole
      });
    }

    next();
  };
};

module.exports = roleMiddleware;