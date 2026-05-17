const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  exportTransactions,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSummary);
router.get('/export', exportTransactions);
router.route('/').get(getTransactions).post(createTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
