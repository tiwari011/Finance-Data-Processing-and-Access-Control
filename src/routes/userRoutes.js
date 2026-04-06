const express = require('express');
const router = express.Router();
const { updateUserRole, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ALL ROUTES REQUIRE ADMIN ROLE


// GET /api/users - Get all users (Admin only)
router.get('/', 
  authMiddleware,              // Must be logged in
  roleMiddleware(['admin']),   // Must be admin
  getAllUsers
);

// PATCH /api/users/:userId/role - Update user role (Admin only)
router.patch('/:userId/role', 
  authMiddleware,
  roleMiddleware(['admin']),
  updateUserRole
);

module.exports = router;