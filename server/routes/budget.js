const express = require('express');
const router = express.Router();
const { getBudget, createOrUpdateBudget, deleteBudget, getBudgetHistory } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/history', getBudgetHistory);
router.route('/').get(getBudget).post(createOrUpdateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
