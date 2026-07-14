import GameStats from '../utils/storage.js';
import { addBalance, removeBalance, addTransaction } from '../utils/storage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');
const gameStatsFile = path.join(dataDir, 'gamestats.json');

function readGameStats() {
  try {
    const data = fs.readFileSync(gameStatsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeGameStats(data) {
  fs.writeFileSync(gameStatsFile, JSON.stringify(data, null, 2));
}

export async function getOrCreateGameStats(userId) {
  const stats = readGameStats();
  let userStats = stats.find((s) => s.userId === userId);

  if (!userStats) {
    userStats = {
      userId,
      rockPaperScissorsWins: 0,
      rockPaperScissorsLosses: 0,
      diceWins: 0,
      diceLosses: 0,
      slotsSpins: 0,
      slotsWins: 0,
      blackjackWins: 0,
      blackjackLosses: 0,
      totalGamesPlayed: 0,
      totalGameWinnings: 0,
      createdAt: new Date(),
    };
    stats.push(userStats);
    writeGameStats(stats);
  }
  return userStats;
}

export async function playRockPaperScissors(userId, userChoice, betAmount) {
  const choices = ['🪨 حجر', '📄 ورقة', '✂️ مقص'];
  const botChoice = choices[Math.floor(Math.random() * 3)];

  let result = 'draw';

  if (userChoice === botChoice) {
    result = 'draw';
  } else if (
    (userChoice === '🪨 حجر' && botChoice === '✂️ مقص') ||
    (userChoice === '📄 ورقة' && botChoice === '🪨 حجر') ||
    (userChoice === '✂️ مقص' && botChoice === '📄 ورقة')
  ) {
    result = 'win';
  } else {
    result = 'lose';
  }

  const stats = readGameStats();
  const userStats = stats.find((s) => s.userId === userId) || (await getOrCreateGameStats(userId));
  userStats.totalGamesPlayed += 1;

  if (result === 'win') {
    const winAmount = Math.floor(betAmount * 1.5);
    await addBalance(userId, winAmount);
    userStats.rockPaperScissorsWins += 1;
    userStats.totalGameWinnings += winAmount;
    await addTransaction(userId, 'game', winAmount, 'ورقة حجر مقص - فوز');
  } else if (result === 'lose') {
    await removeBalance(userId, betAmount);
    userStats.rockPaperScissorsLosses += 1;
  }

  writeGameStats(stats);
  return { result, botChoice, winAmount: result === 'win' ? Math.floor(betAmount * 1.5) : 0 };
}

export async function playDice(userId, bet, prediction) {
  const roll = Math.floor(Math.random() * 6) + 1;
  let result = 'lose';
  let winAmount = 0;

  if (prediction === 'high' && roll > 3) {
    result = 'win';
    winAmount = Math.floor(bet * 2);
  } else if (prediction === 'low' && roll < 4) {
    result = 'win';
    winAmount = Math.floor(bet * 2);
  } else if (prediction === 'even' && roll % 2 === 0) {
    result = 'win';
    winAmount = Math.floor(bet * 1.8);
  } else if (prediction === 'odd' && roll % 2 !== 0) {
    result = 'win';
    winAmount = Math.floor(bet * 1.8);
  }

  const stats = readGameStats();
  const userStats = stats.find((s) => s.userId === userId) || (await getOrCreateGameStats(userId));
  userStats.totalGamesPlayed += 1;

  if (result === 'win') {
    await addBalance(userId, winAmount);
    userStats.diceWins += 1;
    userStats.totalGameWinnings += winAmount;
  } else {
    await removeBalance(userId, bet);
    userStats.diceLosses += 1;
  }

  writeGameStats(stats);
  return { roll, result, winAmount };
}

export async function playSlots(userId, bet) {
  const symbols = ['🍎', '🍊', '🍋', '🍌', '🍉'];
  const reels = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  let result = 'lose';
  let winAmount = 0;

  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    result = 'jackpot';
    winAmount = bet * 10;
  } else if (reels[0] === reels[1] || reels[1] === reels[2]) {
    result = 'win';
    winAmount = bet * 3;
  }

  const stats = readGameStats();
  const userStats = stats.find((s) => s.userId === userId) || (await getOrCreateGameStats(userId));
  userStats.slotsSpins += 1;
  userStats.totalGamesPlayed += 1;

  if (result !== 'lose') {
    await addBalance(userId, winAmount);
    userStats.slotsWins += 1;
    userStats.totalGameWinnings += winAmount;
  } else {
    await removeBalance(userId, bet);
  }

  writeGameStats(stats);
  return { reels, result, winAmount };
}

export async function playBlackjack(userId, bet) {
  const result = Math.random() > 0.5 ? 'win' : 'lose';
  const winAmount = result === 'win' ? Math.floor(bet * 2.5) : 0;

  const stats = readGameStats();
  const userStats = stats.find((s) => s.userId === userId) || (await getOrCreateGameStats(userId));
  userStats.totalGamesPlayed += 1;

  if (result === 'win') {
    await addBalance(userId, winAmount);
    userStats.blackjackWins += 1;
    userStats.totalGameWinnings += winAmount;
  } else {
    await removeBalance(userId, bet);
    userStats.blackjackLosses += 1;
  }

  writeGameStats(stats);
  return { result, winAmount };
}
