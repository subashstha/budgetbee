const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    type: {
      type: String,
      enum: ['expense', 'income', 'both'],
      required: [true, 'Category type is required'],
    },
    color: {
      type: String,
      default: '#94a3b8',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1 });
categorySchema.index({ isDefault: 1 });

module.exports = mongoose.model('Category', categorySchema);
