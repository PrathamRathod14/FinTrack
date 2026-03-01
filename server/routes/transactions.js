const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions
} = require('../controllers/transactionController');
const { validateTransaction, validateId } = require('../middleware/validators');

router.route('/')
  .get(getTransactions)
  .post(validateTransaction, createTransaction)
  .delete(deleteAllTransactions);

router.route('/:id')
  .get(validateId, getTransaction)
  .put(validateId, validateTransaction, updateTransaction)
  .delete(validateId, deleteTransaction);

module.exports = router;
