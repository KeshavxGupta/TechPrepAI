const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - JWT verification
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // If no token, check if email is passed in headers for seamless frontend bridge
    const headerEmail = req.headers['x-user-email'];
    if (headerEmail) {
      try {
        const user = await User.findOne({ email: headerEmail.toLowerCase() }).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (e) {}
    }
    return res.status(401).json({ success: false, message: 'Not authorized to access this resource' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'techprep_ai_super_secret_jwt_key_2026_production');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    if (req.user.suspended) {
      return res.status(403).json({ success: false, message: 'Account is suspended' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

// Grant access to specific roles (e.g. admin)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this endpoint`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
