const { validationResult } = require('express-validator');
const Budget = require('../models/Budget');

// Get all budgets with optional month/year filter
exports.getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = {};

    filter.user = req.user._id;
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const budgets = await Budget.find(filter).sort({ category: 1 });
    res.json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
};

// Get single budget
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
};

// Create budget
exports.createBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check if budget for this category/month/year already exists
    const existing = await Budget.findOne({
      user: req.user._id,
      category: req.body.category,
      month: req.body.month,
      year: req.body.year
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Budget for ${req.body.category} in ${req.body.month}/${req.body.year} already exists`
      });
    }

    const budget = await Budget.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
};

// Update budget
exports.updateBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
};

// Delete budget
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    next(err);
  }
};

// Delete all budgets for a specific month/year
exports.deleteAllBudgets = async (req, res, next) => {
  try {
    const { month, year, confirm } = req.query;

    if (confirm !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm deletion by passing ?confirm=true'
      });
    }

    const filter = { user: req.user._id };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const result = await Budget.deleteMany(filter);
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} budgets`
    });
  } catch (err) {
    next(err);
  }
};
