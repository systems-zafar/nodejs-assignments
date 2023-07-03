const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Access denied.' });
    }

    next();
  } catch (error) {
    console.error('Error authorizing admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const authorizeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'end-user') {
      return res.status(403).json({ message: 'Forbidden. Access denied.' });
    }

    next();
  } catch (error) {
    console.error('Error authorizing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const authorizeUserOrAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current user is the owner or an admin
    if (user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Access denied.' });
    }

    next();
  } catch (error) {
    console.error('Error authorizing user or admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeUser,
  authorizeUserOrAdmin
};
