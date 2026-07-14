import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Transaction from '../models/Transaction.js';

export async function getOrCreateUser(userId, username) {
  let user = await User.findOne({ userId });
  if (!user) {
    user = new User({ userId, username, balance: 1000 });
    await user.save();
  }
  return user;
}

export async function addBalance(userId, amount) {
  const user = await User.findOne({ userId });
  if (user) {
    user.balance += amount;
    await user.save();
    return user.balance;
  }
  return null;
}

export async function removeBalance(userId, amount) {
  const user = await User.findOne({ userId });
  if (user && user.balance >= amount) {
    user.balance -= amount;
    await user.save();
    return user.balance;
  }
  return null;
}

export async function depositToBank(userId, amount) {
  const user = await User.findOne({ userId });
  if (user && user.balance >= amount) {
    user.balance -= amount;
    user.bank += amount;
    await user.save();
    return { balance: user.balance, bank: user.bank };
  }
  return null;
}

export async function withdrawFromBank(userId, amount) {
  const user = await User.findOne({ userId });
  if (user && user.bank >= amount) {
    user.bank -= amount;
    user.balance += amount;
    await user.save();
    return { balance: user.balance, bank: user.bank };
  }
  return null;
}

export async function transferMoney(fromUserId, toUserId, amount) {
  const fromUser = await User.findOne({ userId: fromUserId });
  const toUser = await User.findOne({ userId: toUserId });

  if (fromUser && toUser && fromUser.balance >= amount) {
    fromUser.balance -= amount;
    toUser.balance += amount;

    await fromUser.save();
    await toUser.save();

    await new Transaction({
      userId: fromUserId,
      type: 'transfer',
      amount,
      description: `تحويل أموال إلى ${toUserId}`,
      otherUser: toUserId,
      timestamp: new Date(),
    }).save();

    return true;
  }
  return false;
}

export async function updateStockPrice(stockId, newPrice) {
  const stock = await Stock.findOne({ stockId });
  if (stock) {
    const oldPrice = stock.currentPrice;
    stock.currentPrice = newPrice;
    stock.changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
    stock.priceHistory.push({ price: newPrice, timestamp: new Date() });
    
    if (stock.priceHistory.length > 100) {
      stock.priceHistory.shift();
    }
    
    await stock.save();
    return stock;
  }
  return null;
}

export async function buyStock(userId, stockId, shares) {
  const user = await User.findOne({ userId });
  const stock = await Stock.findOne({ stockId });

  if (!user || !stock) return null;

  const totalCost = stock.currentPrice * shares;
  if (user.balance < totalCost) return null;

  user.balance -= totalCost;
  const existingStock = user.portfolio.find(s => s.stockId === stockId);
  
  if (existingStock) {
    existingStock.shares += shares;
  } else {
    user.portfolio.push({ stockId, shares, buyPrice: stock.currentPrice });
  }

  stock.volume += shares;
  await user.save();
  await stock.save();

  await new Transaction({
    userId,
    type: 'buy',
    amount: totalCost,
    description: `شراء ${shares} سهم من ${stock.name}`,
    itemId: stockId,
    quantity: shares,
  }).save();

  return user;
}

export async function sellStock(userId, stockId, shares) {
  const user = await User.findOne({ userId });
  const stock = await Stock.findOne({ stockId });

  if (!user || !stock) return null;

  const userStock = user.portfolio.find(s => s.stockId === stockId);
  if (!userStock || userStock.shares < shares) return null;

  const totalValue = stock.currentPrice * shares;
  user.balance += totalValue;
  userStock.shares -= shares;

  if (userStock.shares === 0) {
    user.portfolio = user.portfolio.filter(s => s.stockId !== stockId);
  }

  stock.volume -= shares;
  await user.save();
  await stock.save();

  await new Transaction({
    userId,
    type: 'sell',
    amount: totalValue,
    description: `بيع ${shares} سهم من ${stock.name}`,
    itemId: stockId,
    quantity: shares,
  }).save();

  return user;
}
