const express = require('express');
const router = express.Router();
const {
  getSummary,
  getByCategory,
  getMonthlyTrend,
  getDailyTrend,
  getBudgetStatus
} = require('../controllers/analyticsController');

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/daily-trend', getDailyTrend);
router.get('/budget-status', getBudgetStatus);

module.exports = router;
