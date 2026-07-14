import app from './api.js';
import { connectDatabase } from '../config/database.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🌐 لوحة التحكم تعمل على: http://localhost:${PORT}`);
      console.log(`📊 رابط API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ خطأ في بدء السيرفر:', error);
    process.exit(1);
  }
}

startServer();
