# 🤖 Discord Bot 24/7

بوت ديسكورد احترافي يعمل 24/7 ساعات مع دليل أوامر شامل.

## ✨ الميزات

### 📊 نظام النقاط والمستويات
- عرض مستوى اللاعب
- لوحة المتصدرين
- كسب خبرة تلقائية من الرسائل

### ⚙️ أوامر الإدارة
- إعداد البوت
- إدارة الإعدادات
- تخصيص البادئة واللغة

### 🛡️ أوامر الإشراف (9 أوامر)
- الحظر (Ban)
- الطرد (Kick)
- التحذير (Warn)
- الحجب (Timeout)
- الإسكات (Mute)
- إلغاء الإسكات (Unmute)
- حذف الرسائل (Clear)
- الوضع البطيء (Slowmode)

### 🎫 نظام التذاكر
- إنشاء تذاكر دعم خاصة
- إغلاق التذاكر
- تتبع الطلبات

## 📖 دليل الأوامر

### استخدام /help
اكتب `/help` للحصول على دليل شامل لجميع الأوامر

## 🚀 البدء

### المتطلبات
- Node.js 16+
- Discord Bot Token
- Python أو أي منصة hosting

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/Asturas/bot.git
cd bot

# تثبيت المكتبات
npm install

# إنشاء ملف .env
cp .env.example .env

# إضافة توكنك في .env
# DISCORD_TOKEN=your_token_here

# تشغيل البوت
npm start
```

## 🔧 الإعدادات

عدّل ملف `.env` بـ:
```
DISCORD_TOKEN=توكنك
CLIENT_ID=معرف البوت
GUILD_ID=معرف الخادم
```

## 📝 الأوامر الكاملة

#### Leveling
- `/level` - عرض مستواك
- `/leaderboard` - لوحة المتصدرين

#### Help
- `/help` - دليل الأوامر

#### Admin
- `/setup` - إعداد البوت
- `/config prefix` - تغيير البادئة
- `/config language` - تغيير اللغة

#### Moderation (9 أوامر)
- `/ban` - حظر عضو
- `/kick` - طرد عضو
- `/warn` - تحذير عضو
- `/timeout` - حجب عضو عن الكتابة
- `/mute` - إسكات عضو
- `/unmute` - إلغاء إسكات
- `/clear` - حذف رسائل
- `/slowmode` - تفعيل الوضع البطيء

#### Tickets
- `/create-ticket` - إنشاء نظام التذاكر
- `/close-ticket` - إغلاق تذكرة

## 🔐 الصلاحيات المطلوبة

- Manage Guild
- Manage Roles
- Manage Channels
- Ban Members
- Kick Members
- Manage Messages
- Moderate Members
- View Audit Log

## 📞 الدعم

للدعم والمساعدة، استخدم نظام التذاكر في الخادم.

## 📄 الترخيص

MIT License - اقرأ LICENSE للمزيد

---

**تم إنشاؤه بـ ❤️ من قبل Asturas**
