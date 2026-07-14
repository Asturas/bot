import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: String,
  balance: { type: Number, default: 1000 },
  bank: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  inventory: [{
    itemId: String,
    quantity: Number,
    buyPrice: Number,
    currentPrice: Number,
  }],
  portfolio: [{
    stockId: String,
    shares: Number,
    buyPrice: Number,
  }],
  dailyStreak: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
