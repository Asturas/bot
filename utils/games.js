import GameStats from '../models/GameStats.js';
import { addBalance, removeBalance } from './economy.js';
import Transaction from '../models/Transaction.js';

export async function getOrCreateGameStats(userId) {
  let stats = await GameStats.findOne({ userId });
  if (!stats) {
    stats = new GameStats({ userId });
    await stats.save();
  }
  return stats;
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

  const stats = await getOrCreateGameStats(userId);
  stats.totalGamesPlayed += 1;

  if (result === 'win') {
    const winAmount = Math.floor(betAmount * 1.5);
    await addBalance(userId, winAmount);
    stats.rockPaperScissorsWins += 1;
    stats.totalGameWinnings += winAmount;
    await new Transaction({
      userId,
      type: 'game',
      amount: winAmount,
      description: 'ورقة حجر مقص - فوز',
    }).save();
  } else if (result === 'lose') {
    await removeBalance(userId, betAmount);
    stats.rockPaperScissorsLosses += 1;
  }

  await stats.save();
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

  const stats = await getOrCreateGameStats(userId);
  stats.totalGamesPlayed += 1;

  if (result === 'win') {
    await addBalance(userId, winAmount);
    stats.diceWins += 1;
    stats.totalGameWinnings += winAmount;
  } else {
    await removeBalance(userId, bet);
    stats.diceLosses += 1;
  }

  await stats.save();
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

  const stats = await getOrCreateGameStats(userId);
  stats.slotsSpins += 1;
  stats.totalGamesPlayed += 1;

  if (result !== 'lose') {
    await addBalance(userId, winAmount);
    stats.slotsWins += 1;
    stats.totalGameWinnings += winAmount;
  } else {
    await removeBalance(userId, bet);
  }

  await stats.save();
  return { reels, result, winAmount };
}

export async function playBlackjack(userId, bet) {
  // Simplified blackjack - 50/50 chance
  const result = Math.random() > 0.5 ? 'win' : 'lose';
  const winAmount = result === 'win' ? Math.floor(bet * 2.5) : 0;

  const stats = await getOrCreateGameStats(userId);
  stats.totalGamesPlayed += 1;

  if (result === 'win') {
    await addBalance(userId, winAmount);
    stats.blackjackWins += 1;
    stats.totalGameWinnings += winAmount;
  } else {
    await removeBalance(userId, bet);
    stats.blackjackLosses += 1;
  }

  await stats.save();
  return { result, winAmount };
}
