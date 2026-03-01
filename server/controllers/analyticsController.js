const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Helper to build date filter for a month/year
function getDateRange(month, year) {
  const m = parseInt(month);
  const y = parseInt(year);
  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);
  return { $gte: startDate, $lte: endDate };
}

// GET /api/analytics/summary?month=&year=
exports.getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'month and year query parameters are required'
      });
    }

    const dateRange = getDateRange(month, year);

    const [monthResult, allTimeResult] = await Promise.all([
      Transaction.aggregate([
        { $match: { date: dateRange, user: req.user._id } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),
      Transaction.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    let monthIncome = 0, monthExpenses = 0, transactionCount = 0;
    monthResult.forEach(item => {
      if (item._id === 'income') {
        monthIncome = item.total;
        transactionCount += item.count;
      } else {
        monthExpenses = item.total;
        transactionCount += item.count;
      }
    });

    let allIncome = 0, allExpenses = 0;
    allTimeResult.forEach(item => {
      if (item._id === 'income') allIncome = item.total;
      else allExpenses = item.total;
    });

    res.json({
      success: true,
      data: {
        totalBalance: allIncome - allExpenses,
        totalIncome: monthIncome,
        totalExpenses: monthExpenses,
        netBalance: monthIncome - monthExpenses,
        transactionCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/by-category?month=&year=
exports.getByCategory = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'month and year query parameters are required'
      });
    }

    const dateRange = getDateRange(month, year);

    const result = await Transaction.aggregate([
      { $match: { date: dateRange, type: 'expense', user: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const grandTotal = result.reduce((sum, item) => sum + item.total, 0);

    const data = result.map(item => ({
      category: item._id,
      total: item.total,
      percentage: grandTotal > 0 ? Math.round((item.total / grandTotal) * 10000) / 100 : 0,
      transactionCount: item.transactionCount
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/monthly-trend?year=
exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'year query parameter is required'
      });
    }

    const y = parseInt(year);
    const startDate = new Date(y, 0, 1);
    const endDate = new Date(y, 11, 31, 23, 59, 59, 999);

    const result = await Transaction.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate }, user: req.user._id } },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Build 12-month array
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const income = result.find(r => r._id.month === m && r._id.type === 'income');
      const expense = result.find(r => r._id.month === m && r._id.type === 'expense');
      const inc = income ? income.total : 0;
      const exp = expense ? expense.total : 0;
      months.push({
        month: m,
        income: inc,
        expenses: exp,
        net: inc - exp
      });
    }

    res.json({ success: true, data: months });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/daily-trend?month=&year=
exports.getDailyTrend = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'month and year query parameters are required'
      });
    }

    const m = parseInt(month);
    const y = parseInt(year);
    const daysInMonth = new Date(y, m, 0).getDate();
    const dateRange = getDateRange(month, year);

    const result = await Transaction.aggregate([
      { $match: { date: dateRange, type: 'expense', user: req.user._id } },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in all days
    const data = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const found = result.find(r => r._id === d);
      data.push({
        date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        total: found ? found.total : 0
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/budget-status?month=&year=
exports.getBudgetStatus = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'month and year query parameters are required'
      });
    }

    const m = parseInt(month);
    const y = parseInt(year);
    const dateRange = getDateRange(month, year);

    const [budgets, spending] = await Promise.all([
      Budget.find({ user: req.user._id, month: m, year: y }),
      Transaction.aggregate([
        { $match: { date: dateRange, type: 'expense', user: req.user._id } },
        {
          $group: {
            _id: '$category',
            spent: { $sum: '$amount' }
          }
        }
      ])
    ]);

    const data = budgets.map(budget => {
      const spendingEntry = spending.find(s => s._id === budget.category);
      const spent = spendingEntry ? spendingEntry.spent : 0;
      const remaining = budget.monthlyLimit - spent;
      const percentage = budget.monthlyLimit > 0
        ? Math.round((spent / budget.monthlyLimit) * 10000) / 100
        : 0;

      return {
        _id: budget._id,
        category: budget.category,
        limit: budget.monthlyLimit,
        spent,
        remaining,
        percentage
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
