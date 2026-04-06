const Transaction = require('../models/Transaction');

// CREATE TRANSACTION (Admin only)
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please provide amount, type, and category'
      });
    }

    const transaction = new Transaction({
      amount,
      type,
      category,
      date: date || Date.now(),
      description: description || '',
      createdBy: req.user.userId
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET ALL TRANSACTIONS 
const getAllTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    
    let filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET SINGLE TRANSACTION
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// UPDATE TRANSACTION (Admin only)
const updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, type, category, date, description },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// DELETE TRANSACTION (Admin only)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};