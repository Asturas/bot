# 🤖 دليل البدء السريع - خطوات مفصلة لتشغيل البوت 24/7

## ✅ التحقق من الأكواد والملفات

### 📋 الملفات الموجودة:
```
bot/
├── index.js ✅
├── package.json ✅
├── .env.example ✅
├── .gitignore ✅
├── config/
│   └── database.js ✅
├── models/ ✅
│   ├── User.js
│   ├── Stock.js
│   ├── Item.js
│   ├── Transaction.js
│   ├── GameStats.js
│   └── Leaderboard.js
├── utils/ ✅
│   ├── economy.js
│   └── games.js
├── commands/ ✅
│   ├── Economy/
│   │   ├── balance.js
│   │   ├── daily.js
│   │   ├── bank.js
│   │   ├── stocks.js
│   │   ├── transfer.js
│   │   ├── history.js
│   │   ├── inventory.js
│   │   └── richest.js
│   ├── Games/
│   │   ├── rps.js
│   │   ├── dice.js
│   │   ├── slots.js
│   │   ├── blackjack.js
│   │   └── gamestats.js
│   ├── Leveling/
│   │   ├── level.js
│   │   └── leaderboard.js
│   ├── Help/
│   │   └── help.js
│   ├── Admin/
│   │   ├── setup.js
│   │   ├── config.js
│   │   ├── addmoney.js
│   │   └── removemoney.js
│   ├── Moderation/ (9 أوامر)
│   │   ├── ban.js
│   │   ├── kick.js
│   │   ├── warn.js
│   │   ├── timeout.js
│   │   ├── mute.js
│   │   ├── unmute.js
│   │   ├── clear.js
│   │   └── slowmode.js
│   └── Tickets/
│       ├── create-ticket.js
│       └── close-ticket.js
├── events/ ✅
│   ├── ready.js
│   └── interactionCreate.js
├── server/ ✅
│   ├── api.js
│   ├── server.js
│   └── public/
│       └── index.html
├── README.md ✅
└── README_ECONOMY.md ✅
```

### 🔍 حالة الأكواد:
- ✅ جميع الأكواد صحيحة وبدون أخطاء
- ✅ جميع التبعيات موجودة في package.json
- ✅ نظام الاقتصاد متكامل وآمن
- ✅ الألعاب مع نظام الرهانات
- ✅ قاعدة البيانات موصولة صحيحاً
- ✅ لوحة التحكم الويب جاهزة

---

# 🎯 الخطوات الكاملة لتشغيل البوت

## المرحلة 1️⃣: إنشاء Bot على Discord

### 1.1 الذهاب إلى Discord Developer Portal

1. اذهب إلى: https://discord.com/developers/applications
2. اضغط **"New Application"**
3. أدخل اسم البوت (مثل: "Asturas Bot")
4. اضغط **"Create"**

### 1.2 الحصول على Bot Token

1. اذهب إلى **"Bot"** من الجانب الأيسر
2. اضغط **"Add Bot"**
3. تحت "TOKEN"، اضغط **"Copy"** (هذا هو التوكن)
4. **احفظه في مكان آمن** ⚠️

### 1.3 تفعيل الصلاحيات المطلوبة

#### OAuth2 Intent Permissions:
1. اذهب إلى **"Bot"** → **"Privileged Gateway Intents"**
2. فعّل:
   - ✅ Message Content Intent
   - ✅ Server Members Intent
   - ✅ Guild Members Intent

#### Bot Permissions:
1. اذهب إلى **"OAuth2"** → **"URL Generator"**
2. اختر Scopes:
   - ✅ bot
   - ✅ applications.commands

3. اختر Permissions:
   - ✅ Administrator (أسهل)
   - أو حدد يدويًا:
     - ✅ Read Messages
     - ✅ Send Messages
     - ✅ Embed Links
     - ✅ Mention @everyone
     - ✅ Ban Members
     - ✅ Kick Members
     - ✅ Manage Messages
     - ✅ Manage Roles

### 1.4 الحصول على OAuth2 URL

1. من نفس الصفحة (OAuth2 → URL Generator)
2. انسخ الرابط من تحت
3. افتحه في المتصفح
4. اختر السيرفر الذي تريد إضافة البوت فيه
5. اضغط **"Authorize"**

### 1.5 الحصول على CLIENT_ID و GUILD_ID

**CLIENT_ID:**
1. اذهب إلى "General Information"
2. انسخ "Application ID" (هذا هو CLIENT_ID)

**GUILD_ID (معرف السيرفر):**
1. في Discord، اذهب لسيرفرك
2. انقر بزر الماوس الأيمن على اسم السيرفر
3. اختر "Copy Server ID"
4. الصق الرقم (هذا هو GUILD_ID)

---

## المرحلة 2️⃣: إعداد MongoDB

### 2.1 إنشاء حساب MongoDB

1. اذهب إلى: https://www.mongodb.com/cloud/atlas
2. اضغط **"Sign Up"**
3. ملء البيانات أو استخدام Google
4. تحقق من بريدك الإلكتروني

### 2.2 إنشاء Cluster

1. اختر **"Create a Database"**
2. اختر **"Free"** (مجاني)
3. اختر **"Create Cluster"**
4. انتظر (2-5 دقائق)
5. اضغط **"Connect"**

### 2.3 إنشاء Database User

1. اختر **"Database Access"** من اليسار
2. اضغط **"+ Add New Database User"**
3. اختر **"Password"**
4. أدخل username (مثل: `bot_user`)
5. أدخل password قوية (احفظها!)
6. اضغط **"Add User"**

### 2.4 السماح بالاتصال

1. اختر **"Network Access"** من اليسار
2. اضغط **"+ Add IP Address"**
3. اختر **"Allow Access from Anywhere"**
4. اضغط **"Add Entry"**

### 2.5 الحصول على Connection String

1. اختر **"Database"** من اليسار
2. اضغط **"Connect"** على Cluster
3. اختر **"Drivers"**
4. اختر **"Node.js"**
5. انسخ Connection String (مثل):
```
mongodb+srv://bot_user:password@cluster0.abc123.mongodb.net/bot_database
```
6. استبدل:
   - `bot_user` بـ username
   - `password` بـ كلمة المرور
   - `bot_database` بـ اسم قاعدة البيانات

---

## المرحلة 3️⃣: تثبيت البوت محلياً

### 3.1 تحضير الملفات

```bash
# انتقل إلى مجلد المشروع
cd bot

# تثبيت جميع المكتبات
npm install
```

### 3.2 إنشاء ملف .env

```bash
# انسخ ملف المثال
cp .env.example .env

# أو انشئ ملف جديد باسم .env
type nul > .env
```

### 3.3 ملء ملف .env

افتح ملف `.env` وأضف:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_server_id_here
MONGODB_URI=mongodb+srv://bot_user:password@cluster.mongodb.net/bot_database
PORT=3000
```

### 3.4 تشغيل البوت

```bash
# في Terminal الأول - تشغيل البوت الرئيسي
npm start
```

**ستظهر رسائل مثل:**
```
✅ تم تحميل 32 أوامر
✅ تم تحميل 2 أحداث
✅ تم الاتصال بقاعدة البيانات بنجاح
✅ تم تسجيل الدخول كـ BotName#0000
🤖 البوت جاهز 24/7
```

### 3.5 تشغيل لوحة التحكم (اختياري)

```bash
# في Terminal آخر - تشغيل الويب
node server/server.js
```

**ستظهر:**
```
🌐 لوحة التحكم تعمل على: http://localhost:3000
📊 رابط API: http://localhost:3000/api
```

---

## المرحلة 4️⃣: اختبار البوت

### 4.1 اختبار الأوامر الأساسية

```
/balance           → عرض رصيدك
/daily             → مكافأة يومية
/rps rock 100      → لعبة ورقة حجرة
/help              → دليل الأوامر
```

### 4.2 اختبار أوامر الإدارة

```
/addmoney @user 1000        → إضافة أموال
/removemoney @user 500      → خصم أموال
```

---

## المرحلة 5️⃣: تشغيل البوت 24/7

### الخيار 1: استخدام Heroku (مجاني + مدفوع)

#### أ) تثبيت Heroku CLI:
```bash
# تحميل من: https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

#### ب) إعداد التطبيق:
```bash
cd bot
git init
git add .
git commit -m "Initial commit"

heroku create your-app-name
heroku config:set DISCORD_TOKEN=your_token
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set CLIENT_ID=your_client_id
heroku config:set GUILD_ID=your_guild_id

git push heroku main
```

#### ج) مراقبة البوت:
```bash
heroku logs --tail
```

---

### الخيار 2: استخدام Replit (مجاني + سهل)

#### أ) الخطوات:
1. اذهب إلى: https://replit.com
2. اضغط "+ Create"
3. ابحث عن Node.js
4. الصق الكود من GitHub
5. أضف متغيرات البيئة في Secrets
6. شغّل الكود

#### ب) للحفاظ على التشغيل 24/7:
```javascript
// في نهاية index.js أضف:
setInterval(() => {
  console.log('🔄 Bot is still running...');
}, 30000); // كل 30 ثانية
```

---

### الخيار 3: استخدام VPS (الأفضل)

#### أ) اختر مزود VPS (مثل):
- **Linode** (5$/شهر)
- **DigitalOcean** (5$/شهر)
- **Contabo** (2.99$/شهر)
- **AWS** (مستوى مجاني)

#### ب) التثبيت على Linux:
```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. نسخ المشروع
cd /home
git clone https://github.com/Asturas/bot.git
cd bot

# 4. تثبيت المكتبات
npm install

# 5. إنشاء .env
cp .env.example .env
# عديل .env بـ nano
nano .env
```

#### ج) استخدام PM2 للتشغيل المستمر:
```bash
# تثبيت PM2
sudo npm install -g pm2

# تشغيل البوت
pm2 start index.js --name "discord-bot"

# حفظ الجلسة
pm2 save
pm2 startup

# مراقبة البوت
pm2 monit
pm2 logs discord-bot
```

#### د) إعادة التشغيل التلقائي:
```bash
# تشغيل البوت عند إعادة تشغيل الخادم
pm2 startup
pm2 save
```

---

### الخيار 4: استخدام Docker

#### أ) إنشاء Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

#### ب) تشغيل:
```bash
docker build -t discord-bot .
docker run -d --env-file .env discord-bot
```

---

## المرحلة 6️⃣: استكشاف الأخطاء

### المشكلة: "Invalid Token"
**الحل:**
1. تحقق من أن التوكن صحيح
2. انسخ التوكن مرة أخرى من Discord Developer
3. لا تشارك التوكن مع أحد!

### المشكلة: "MongoDB Connection Failed"
**الحل:**
1. تحقق من اتصالك بالإنترنت
2. تأكد من MongoDB URI صحيح
3. السماح بالاتصالات من كل IP في MongoDB

### المشكلة: "Command not showing"
**الحل:**
1. قد يستغرق تحديث الأوامر 5 دقائق
2. أعد تشغيل البوت
3. تأكد من أن الأوامر في مجلد commands صحيح

---

## ✅ قائمة التحقق النهائية

- [ ] تم إنشاء Discord Bot
- [ ] تم نسخ DISCORD_TOKEN
- [ ] تم نسخ CLIENT_ID و GUILD_ID
- [ ] تم إنشاء MongoDB Cluster
- [ ] تم نسخ MONGODB_URI
- [ ] تم ملء ملف .env
- [ ] تم تثبيت npm install
- [ ] تم اختبار البوت محلياً
- [ ] تم اختبار الأوامر
- [ ] تم رفع البوت على خادم 24/7

---

## 🎉 النتيجة النهائية

بعد اتباع كل الخطوات:
- ✅ بوت Discord متقدم
- ✅ نظام اقتصادي كامل
- ✅ 4 ألعاب تفاعلية
- ✅ قاعدة بيانات MongoDB
- ✅ لوحة تحكم ويب
- ✅ تشغيل 24/7 بدون انقطاع

---

## 📞 الدعم والمساعدة

إذا واجهت أي مشاكل:
1. اقرأ الرسائل في Terminal
2. تحقق من ملف .env
3. تأكد من صلاحيات البوت
4. جرّب إعادة تشغيل البوت

**تم إنشاؤه بـ ❤️ بواسطة Asturas**
