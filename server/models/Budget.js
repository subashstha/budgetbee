const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    categoryBudgets: [
      {
        category: {
          type: String,
          required: true,
          trim: true,
        },
        limit: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    alertThreshold: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
