const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { transactionLimiter } = require('../middlewares/rateLimiter');

// ═══════════════════════════════════════════════════════════
// ALL ROUTES REQUIRE AUTHENTICATION
// ═══════════════════════════════════════════════════════════

router.use(authMiddleware);

// ═══════════════════════════════════════════════════════════
// TRANSACTION ROUTES
// ═══════════════════════════════════════════════════════════

// GET /api/transactions - Get all transactions (All users can view)
// Supports query parameters: ?type=income&category=Salary&startDate=2025-01-01&endDate=2025-01-31
router.get('/', getAllTransactions);

// GET /api/transactions/:id - Get single transaction by ID (All users can view)
router.get('/:id', getTransaction);

// POST /api/transactions - Create new transaction (Admin only + Rate limited)
router.post('/', 
  transactionLimiter,              // Rate limit: 10 requests per minute
  roleMiddleware(['admin']),       // Only admin can create
  createTransaction
);

// PUT /api/transactions/:id - Update existing transaction (Admin only)
router.put('/:id', 
  roleMiddleware(['admin']),       // Only admin can update
  updateTransaction
);

// DELETE /api/transactions/:id - Delete transaction (Admin only)
router.delete('/:id', 
  roleMiddleware(['admin']),       // Only admin can delete
  deleteTransaction
);

module.exports = router;