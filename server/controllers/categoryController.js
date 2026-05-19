const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense', color: '#f97316' },
  { name: 'Transportation', type: 'expense', color: '#3b82f6' },
  { name: 'Shopping', type: 'expense', color: '#8b5cf6' },
  { name: 'Bills', type: 'expense', color: '#ef4444' },
  { name: 'Entertainment', type: 'expense', color: '#ec4899' },
  { name: 'Health', type: 'expense', color: '#10b981' },
  { name: 'Education', type: 'expense', color: '#06b6d4' },
  { name: 'Travel', type: 'expense', color: '#f59e0b' },
  { name: 'Saving', type: 'expense', color: '#0d9488' },
  { name: 'SIP', type: 'expense', color: '#6366f1' },
  { name: 'Cooperative', type: 'both', color: '#d97706' },
  { name: 'Salary', type: 'both', color: '#22c55e' },
  { name: 'Freelance', type: 'income', color: '#0ea5e9' },
  { name: 'Investment', type: 'income', color: '#14b8a6' },
  { name: 'Gift', type: 'income', color: '#e879f9' },
  { name: 'Others', type: 'both', color: '#94a3b8' },
];

const seedDefaults = async () => {
  const count = await Category.countDocuments({ isDefault: true });
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((c) => ({ ...c, isDefault: true, userId: null })));
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ isDefault: true }, { userId: req.user._id }],
    }).sort({ isDefault: -1, name: 1 });

    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      $or: [{ isDefault: true }, { userId: req.user._id }],
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      color: color || '#94a3b8',
      userId: req.user._id,
      isDefault: false,
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user._id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found or cannot be edited' });
    }

    const { name, type, color } = req.body;
    if (name) category.name = name.trim();
    if (type) category.type = type;
    if (color) category.color = color;

    await category.save();
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user._id, isDefault: false });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found or cannot be deleted' });
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, seedDefaults };
