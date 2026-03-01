const { validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const { CURRENCIES } = require('../../shared/constants');

// Get settings (create default if none exist)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });
    if (!settings) {
      settings = await Settings.create({
        user: req.user._id,
        currency: 'EUR',
        currencySymbol: '€'
      });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// Update settings
exports.updateSettings = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currency, currencySymbol } = req.body;

    // Validate currency code
    const validCurrency = CURRENCIES.find(c => c.code === currency);
    if (!validCurrency) {
      return res.status(400).json({
        success: false,
        message: `Invalid currency. Must be one of: ${CURRENCIES.map(c => c.code).join(', ')}`
      });
    }

    let settings = await Settings.findOne({ user: req.user._id });
    if (!settings) {
      settings = await Settings.create({ user: req.user._id, currency, currencySymbol });
    } else {
      settings.currency = currency;
      settings.currencySymbol = currencySymbol;
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
