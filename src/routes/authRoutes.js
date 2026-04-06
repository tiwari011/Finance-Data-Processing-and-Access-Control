const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerAdmin } = require('../controllers/authController');
const { authLimiter, adminRegisterLimiter } = require('../middlewares/rateLimiter');  // ← ADD THIS

// POST /api/auth/register - Apply auth limiter
router.post('/register', authLimiter, registerUser);  // ← ADD authLimiter

// POST /api/auth/login - Apply auth limiter
router.post('/login', authLimiter, loginUser);  // ← ADD authLimiter

// POST /api/auth/register-admin - Strict limiter
router.post('/register-admin', adminRegisterLimiter, registerAdmin);  // ← ADD adminRegisterLimiter

module.exports = router;