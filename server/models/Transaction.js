const mongoose = require('mongoose');
const { CATEGORIES, PAYMENT_METHODS, TRANSACTION_TYPES } = require('../../shared/constants');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: [true, 'Transaction type is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'Cash'
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
