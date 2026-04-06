const Transaction = require('../models/Transaction');

// GET SUMMARY (Analyst & Admin)
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET CATEGORY BREAKDOWN (Analyst & Admin)
const getCategoryBreakdown = async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const categoryData = {};

    transactions.forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { income: 0, expense: 0, total: 0 };
      }
      
      if (t.type === 'income') {
        categoryData[t.category].income += t.amount;
      } else {
        categoryData[t.category].expense += t.amount;
      }
      
      categoryData[t.category].total = 
        categoryData[t.category].income - categoryData[t.category].expense;
    });

    res.json({
      success: true,
      categoryBreakdown: categoryData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET MONTHLY TRENDS (Analyst & Admin)
const getMonthlyTrends = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1 });

    const monthlyData = {};

    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, net: 0 };
      }
      
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
      
      monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense;
    });

    res.json({
      success: true,
      monthlyTrends: monthlyData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET RECENT ACTIVITY (All users)
const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const transactions = await Transaction.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: transactions.length,
      recentActivity: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
};