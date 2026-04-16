import express from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// Get all expenses + summary
router.get('/', async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit = 50 } = req.query;
    const filter = { user: req.userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit));

    const all = await Expense.find({ user: req.userId });
    const totalIncome = all.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpense = all.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

    res.json({ expenses, summary: { totalIncome, totalExpense, balance: totalIncome - totalExpense } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.userId });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Monthly chart data
router.get('/stats/monthly', async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Category breakdown
router.get('/stats/categories', async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { user: req.userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
