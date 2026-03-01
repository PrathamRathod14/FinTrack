const { body, param, query } = require('express-validator');
const { CATEGORIES, PAYMENT_METHODS, TRANSACTION_TYPES } = require('../../shared/constants');

const validateTransaction = [
  body('type')
    .isIn(TRANSACTION_TYPES)
    .withMessage(`Type must be one of: ${TRANSACTION_TYPES.join(', ')}`),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('paymentMethod')
    .optional()
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const validateBudget = [
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('monthlyLimit')
    .isFloat({ min: 1 })
    .withMessage('Monthly limit must be at least 1'),
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year')
    .isInt({ min: 2020, max: 2100 })
    .withMessage('Year must be between 2020 and 2100')
];

const validateSettings = [
  body('currency')
    .notEmpty()
    .withMessage('Currency code is required'),
  body('currencySymbol')
    .notEmpty()
    .withMessage('Currency symbol is required')
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

module.exports = {
  validateTransaction,
  validateBudget,
  validateSettings,
  validateId
};
