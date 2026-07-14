import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  stockId: { type: String, required: true, unique: true },
  name: String,
  description: String,
  basePrice: Number,
  currentPrice: Number,
  volume: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  totalShares: Number,
  emoji: String,
  priceHistory: [{
    price: Number,
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Stock', stockSchema);
