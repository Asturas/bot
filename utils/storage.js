import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');

// إنشاء مجلد data إذا لم يكن موجوداً
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// مسارات الملفات
const filePaths = {
  users: path.join(dataDir, 'users.json'),
  stocks: path.join(dataDir, 'stocks.json'),
  transactions: path.join(dataDir, 'transactions.json'),
  gameStats: path.join(dataDir, 'gamestats.json'),
};

// إنشاء ملفات فارغة إذا لم تكن موجودة
function initializeFiles() {
  Object.values(filePaths).forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  });
}

initializeFiles();

// قراءة البيانات
function readData(dataType) {
  try {
    const data = fs.readFileSync(filePaths[dataType], 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// كتابة البيانات
function writeData(dataType, data) {
  try {
    fs.writeFileSync(filePaths[dataType], JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`❌ خطأ في حفظ ${dataType}:`, error);
    return false;
  }
}

// دوال المستخدمين
export async function getOrCreateUser(userId, username) {
  const users = readData('users');
  let user = users.find((u) => u.userId === userId);

  if (!user) {
    user = {
      userId,
      username,
      balance: 1000,
      bank: 0,
      level: 1,
      xp: 0,
      inventory: [],
      portfolio: [],
      dailyStreak: 0,
      lastDaily: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    writeData('users', users);
  }

  return user;
}

export async function addBalance(userId, amount) {
  const users = readData('users');
  const user = users.find((u) => u.userId === userId);

  if (user) {
    user.balance += amount;
    user.updatedAt = new Date();
    writeData('users', users);
    return user.balance;
  }
  return null;
}

export async function removeBalance(userId, amount) {
  const users = readData('users');
  const user = users.find((u) => u.userId === userId);

  if (user && user.balance >= amount) {
    user.balance -= amount;
    user.updatedAt = new Date();
    writeData('users', users);
    return user.balance;
  }
  return null;
}

export async function depositToBank(userId, amount) {
  const users = readData('users');
  const user = users.find((u) => u.userId === userId);

  if (user && user.balance >= amount) {
    user.balance -= amount;
    user.bank += amount;
    user.updatedAt = new Date();
    writeData('users', users);
    return { balance: user.balance, bank: user.bank };
  }
  return null;
}

export async function withdrawFromBank(userId, amount) {
  const users = readData('users');
  const user = users.find((u) => u.userId === userId);

  if (user && user.bank >= amount) {
    user.bank -= amount;
    user.balance += amount;
    user.updatedAt = new Date();
    writeData('users', users);
    return { balance: user.balance, bank: user.bank };
  }
  return null;
}

export async function transferMoney(fromUserId, toUserId, amount) {
  const users = readData('users');
  const fromUser = users.find((u) => u.userId === fromUserId);
  const toUser = users.find((u) => u.userId === toUserId);

  if (fromUser && toUser && fromUser.balance >= amount) {
    fromUser.balance -= amount;
    toUser.balance += amount;
    fromUser.updatedAt = new Date();
    toUser.updatedAt = new Date();
    writeData('users', users);

    const transactions = readData('transactions');
    transactions.push({
      userId: fromUserId,
      type: 'transfer',
      amount,
      description: `تحويل أموال إلى ${toUserId}`,
      otherUser: toUserId,
      timestamp: new Date(),
    });
    writeData('transactions', transactions);

    return true;
  }
  return false;
}

export async function addTransaction(userId, type, amount, description, itemId = null, quantity = null) {
  const transactions = readData('transactions');
  transactions.push({
    userId,
    type,
    amount,
    description,
    itemId,
    quantity,
    timestamp: new Date(),
  });
  writeData('transactions', transactions);
}

// دوال الأسهم
export async function getOrCreateStocks() {
  const stocks = readData('stocks');
  if (stocks.length === 0) {
    const defaultStocks = [
      {
        stockId: 'tech',
        name: 'Tech Company',
        emoji: '💻',
        basePrice: 100,
        currentPrice: 100,
        volume: 0,
        changePercent: 0,
        priceHistory: [{ price: 100, timestamp: new Date() }],
      },
      {
        stockId: 'gold',
        name: 'Gold Trading',
        emoji: '🏆',
        basePrice: 150,
        currentPrice: 150,
        volume: 0,
        changePercent: 0,
        priceHistory: [{ price: 150, timestamp: new Date() }],
      },
      {
        stockId: 'crypto',
        name: 'Crypto Currency',
        emoji: '₿',
        basePrice: 200,
        currentPrice: 200,
        volume: 0,
        changePercent: 0,
        priceHistory: [{ price: 200, timestamp: new Date() }],
      },
    ];
    writeData('stocks', defaultStocks);
    return defaultStocks;
  }
  return stocks;
}

export async function buyStock(userId, stockId, shares) {
  const users = readData('users');
  const user = users.find((u) => u.userId === userId);
  const stocks = await getOrCreateStocks();
  const stock = stocks.find((s) => s.stockId === stockId);

  if (!user || !stock) return null;

  const totalCost = stock.currentPrice * shares;
  if (user.balance < totalCost) return null;

  user.balance -= totalCost;
  const existingStock = user.portfolio.find((s) => s.stockId === stockId);

  if (existingStock) {
    existingStock.shares += shares;
  } else {
    user.portfolio.push({ stockId, shares, buyPrice: stock.currentPrice });
  }

  stock.volume += shares;
  user.updatedAt = new Date();

  writeData('users', users);
  writeData('stocks', stocks);
  addTransaction(userId, 'buy', totalCost, `شراء ${shares} سهم من ${stock.name}`, stockId, shares);

  return user;
}

export async function sellStock(userId, stockId, shares) {
  const users = readData('users');
  const user = users.find((u) => u.userId === userId);
  const stocks = await getOrCreateStocks();
  const stock = stocks.find((s) => s.stockId === stockId);

  if (!user || !stock) return null;

  const userStock = user.portfolio.find((s) => s.stockId === stockId);
  if (!userStock || userStock.shares < shares) return null;

  const totalValue = stock.currentPrice * shares;
  user.balance += totalValue;
  userStock.shares -= shares;

  if (userStock.shares === 0) {
    user.portfolio = user.portfolio.filter((s) => s.stockId !== stockId);
  }

  stock.volume -= shares;
  user.updatedAt = new Date();

  writeData('users', users);
  writeData('stocks', stocks);
  addTransaction(userId, 'sell', totalValue, `بيع ${shares} سهم من ${stock.name}`, stockId, shares);

  return user;
}
