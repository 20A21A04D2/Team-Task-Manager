const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token valid for 15 minutes
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey_54321', {
    expiresIn: '7d', // Refresh token valid for 7 days
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
