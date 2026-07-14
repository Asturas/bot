import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: String,
  description: String,
  price: Number,
  rarity: { enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  emoji: String,
  sellValue: Number,
  effect: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Item', itemSchema);
