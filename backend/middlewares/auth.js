const jwt = require('jsonwebtoken');
// const redisClient = require('../config/redis');
require('dotenv').config();
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
}

// Middleware kiểm tra token JWT
const authenticateToken = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  // Ưu tiên header trước, sau đó đến cookie
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies.token;
  }

  console.log("Token from header:", req.headers.authorization);
  console.log("Token from cookies:", req.cookies.token);
  console.log("Selected token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};
module.exports = { auth, authenticateToken }; 