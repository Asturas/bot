import mongoose from 'mongoose';

const gameStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  rockPaperScissorsWins: { type: Number, default: 0 },
  rockPaperScissorsLosses: { type: Number, default: 0 },
  diceWins: { type: Number, default: 0 },
  diceLosses: { type: Number, default: 0 },
  slotsSpins: { type: Number, default: 0 },
  slotsWins: { type: Number, default: 0 },
  blackjackWins: { type: Number, default: 0 },
  blackjackLosses: { type: Number, default: 0 },
  totalGamesPlayed: { type: Number, default: 0 },
  totalGameWinnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('GameStats', gameStatsSchema);
