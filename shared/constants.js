const CATEGORIES = [
  'Food',
  'Rent',
  'Transport',
  'Health',
  'Shopping',
  'Utilities',
  'Education',
  'Travel',
  'Salary',
  'Entertainment',
  'Others'
];

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer'];

const TRANSACTION_TYPES = ['expense', 'income'];

const CURRENCIES = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' }
];

module.exports = {
  CATEGORIES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
  CURRENCIES
};
