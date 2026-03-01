const express = require('express');
const router = express.Router();
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  deleteAllBudgets
} = require('../controllers/budgetController');
const { validateBudget, validateId } = require('../middleware/validators');

router.route('/')
  .get(getBudgets)
  .post(validateBudget, createBudget)
  .delete(deleteAllBudgets);

router.route('/:id')
  .get(validateId, getBudget)
  .put(validateId, validateBudget, updateBudget)
  .delete(validateId, deleteBudget);

module.exports = router;
