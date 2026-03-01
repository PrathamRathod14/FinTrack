const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

// Get all transactions with filtering, search, and pagination
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, category, month, year, search, limit, page = 1 } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const pageSize = parseInt(limit) || 20;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Transaction.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / pageSize),
        limit: pageSize
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get single transaction
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

// Create transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const transaction = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

// Delete single transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};

// Delete all transactions
exports.deleteAllTransactions = async (req, res, next) => {
  try {
    if (req.query.confirm !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm deletion by passing ?confirm=true'
      });
    }

    const result = await Transaction.deleteMany({ user: req.user._id });
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} transactions`
    });
  } catch (err) {
    next(err);
  }
};
