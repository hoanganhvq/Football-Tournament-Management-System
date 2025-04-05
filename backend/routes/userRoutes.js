const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');
//Nếu export theo object { authenticateToken }, khi import phải dùng {}.

// Load environment variables
require('dotenv').config();

// Đăng ký người dùng
router.post('/register', userController.register);

// Đăng nhập và tạo JWT
router.post('/login', userController.login);

// // Logout và đưa token vào blacklist
// router.post('/logout', authenticateToken, userController.logout);
router.get('/me', authenticateToken, userController.getUser);

router.put('/me', authenticateToken, userController.updateUser)

module.exports = router;
