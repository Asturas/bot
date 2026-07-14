import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rank: { type: Number, default: 0 },
  totalWealth: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Leaderboard', leaderboardSchema);
