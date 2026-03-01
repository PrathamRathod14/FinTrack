const mongoose = require('mongoose');
const { CURRENCIES } = require('../../shared/constants');

const validCodes = CURRENCIES.map(c => c.code);

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    currency: {
      type: String,
      enum: validCodes,
      default: 'EUR'
    },
    currencySymbol: {
      type: String,
      default: '€'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
