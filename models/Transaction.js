import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: { enum: ['buy', 'sell', 'transfer', 'daily', 'game', 'admin'], required: true },
  amount: Number,
  description: String,
  otherUser: String,
  itemId: String,
  quantity: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
