const mongoose = require('mongoose');
const { CATEGORIES } = require('../../shared/constants');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required']
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly limit is required'],
      min: [1, 'Monthly limit must be at least 1']
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2020,
      max: 2100
    }
  },
  {
    timestamps: true
  }
);

budgetSchema.index({ user: 1, month: 1, year: 1 });
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
