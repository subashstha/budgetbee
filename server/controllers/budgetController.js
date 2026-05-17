const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @route GET /api/budget
const getBudget = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = parseInt(month) || now.getMonth() + 1;
    const targetYear = parseInt(year) || now.getFullYear();

    let budget = await Budget.findOne({ userId: req.user._id, month: targetMonth, year: targetYear });

    // Calculate actual spent amount from transactions
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const spentData = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const totalSpent = spentData.reduce((acc, item) => acc + item.spent, 0);

    if (budget) {
      budget = budget.toObject();
      budget.spentAmount = totalSpent;
      budget.remaining = budget.totalBudget - totalSpent;
      budget.percentUsed = budget.totalBudget > 0
        ? Math.round((totalSpent / budget.totalBudget) * 100)
        : 0;
      budget.categorySpent = spentData;
    }

    res.json({ success: true, budget: budget || null, totalSpent });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/budget
const createOrUpdateBudget = async (req, res, next) => {
  try {
    const { month, year, totalBudget, categoryBudgets, alertThreshold } = req.body;
    const now = new Date();

    const budgetData = {
      userId: req.user._id,
      month: month || now.getMonth() + 1,
      year: year || now.getFullYear(),
      totalBudget,
      categoryBudgets: categoryBudgets || [],
      alertThreshold: alertThreshold || 80,
    };

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month: budgetData.month, year: budgetData.year },
      budgetData,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/budget/:id
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    await budget.deleteOne();
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/budget/history
const getBudgetHistory = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ year: -1, month: -1 }).limit(12);
    res.json({ success: true, budgets });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudget, createOrUpdateBudget, deleteBudget, getBudgetHistory };
