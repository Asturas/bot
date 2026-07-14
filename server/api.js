import express from 'express';
import cors from 'cors';
import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Transaction from '../models/Transaction.js';
import GameStats from '../models/GameStats.js';

const app = express();
app.use(cors());
app.use(express.json());

// Dashboard Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ balance: -1 }).limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stock/:stockId', async (req, res) => {
  try {
    const stock = await Stock.findOne({ stockId: req.params.stockId });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ balance: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/game-stats/:userId', async (req, res) => {
  try {
    const stats = await GameStats.findOne({ userId: req.params.userId });
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/global', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBalance = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    const totalTransactions = await Transaction.countDocuments();
    
    res.json({
      totalUsers,
      totalBalance: totalBalance[0]?.total || 0,
      totalTransactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🤖 البوت يعمل بنجاح!' });
});

export default app;
