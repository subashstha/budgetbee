const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @route GET /api/transactions
const getTransactions = async (req, res, next) => {
  try {
    const {
      type, category, startDate, endDate,
      minAmount, maxAmount, search,
      sortBy = 'date', sortOrder = 'desc',
      page = 1, limit = 20,
    } = req.query;

    const filter = { userId: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      date: 'date',
      amount: 'amount',
      title: 'title',
    };
    const sort = { [sortMap[sortBy] || 'date']: sortOrder === 'asc' ? 1 : -1 };

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: transactions.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/transactions
const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({ ...req.body, userId: req.user._id });

    // Update budget spent amount
    if (transaction.type === 'expense') {
      const date = new Date(transaction.date);
      await Budget.findOneAndUpdate(
        { userId: req.user._id, month: date.getMonth() + 1, year: date.getFullYear() },
        { $inc: { spentAmount: transaction.amount } }
      );
    }

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/transactions/:id
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const oldAmount = transaction.type === 'expense' ? transaction.amount : 0;
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });

    // Recalculate budget if expense changed
    if (transaction.type === 'expense' || updated.type === 'expense') {
      const date = new Date(transaction.date);
      const amountDiff =
        (updated.type === 'expense' ? updated.amount : 0) - oldAmount;
      if (amountDiff !== 0) {
        await Budget.findOneAndUpdate(
          { userId: req.user._id, month: date.getMonth() + 1, year: date.getFullYear() },
          { $inc: { spentAmount: amountDiff } }
        );
      }
    }

    res.json({ success: true, transaction: updated });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/transactions/:id
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await transaction.deleteOne();

    // Adjust budget if expense deleted
    if (transaction.type === 'expense') {
      const date = new Date(transaction.date);
      await Budget.findOneAndUpdate(
        { userId: req.user._id, month: date.getMonth() + 1, year: date.getFullYear() },
        { $inc: { spentAmount: -transaction.amount } }
      );
    }

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/transactions/summary
const getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = parseInt(month) || now.getMonth() + 1;
    const targetYear = parseInt(year) || now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const [summary] = await Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const monthlyTrend = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: {
            $gte: new Date(targetYear, 0, 1),
            $lte: new Date(targetYear, 11, 31, 23, 59, 59),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      success: true,
      summary: {
        totalIncome: summary?.totalIncome || 0,
        totalExpense: summary?.totalExpense || 0,
        balance: (summary?.totalIncome || 0) - (summary?.totalExpense || 0),
        transactionCount: summary?.count || 0,
      },
      categoryBreakdown,
      monthlyTrend,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/transactions/export
const exportTransactions = async (req, res, next) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    const filter = { userId: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    if (format === 'csv') {
      const headers = 'Date,Title,Type,Category,Amount,Payment Method,Notes\n';
      const rows = transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          `"${t.title}"`,
          t.type,
          t.category,
          t.amount,
          t.paymentMethod,
          `"${t.notes || ''}"`,
        ].join(',')
      );
      const csv = headers + rows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      return res.send(csv);
    }

    if (format === 'json') {
      return res.json({ success: true, transactions });
    }

    res.json({ success: false, message: 'Format not supported' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  exportTransactions,
};
