const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
} = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Recent activity - All users
router.get('/recent', getRecentActivity);

// Summary - Analyst & Admin only
router.get('/summary', roleMiddleware(['analyst', 'admin']), getSummary);

// Category breakdown - Analyst & Admin only
router.get('/category-breakdown', roleMiddleware(['analyst', 'admin']), getCategoryBreakdown);

// Monthly trends - Analyst & Admin only
router.get('/monthly-trends', roleMiddleware(['analyst', 'admin']), getMonthlyTrends);

module.exports = router;