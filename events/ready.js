export const name = 'ready';
export const once = true;

export async function execute(client) {
  console.log(`✅ تم تسجيل الدخول كـ ${client.user.tag}`);
  console.log(`🤖 البوت جاهز 24/7`);
  client.user.setActivity('الأوامر | /help', { type: 'LISTENING' });
}
