import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Transaction from '../../models/Transaction.js';

export const data = new SlashCommandBuilder()
  .setName('history')
  .setDescription('عرض سجل معاملاتك')
  .addIntegerOption((option) =>
    option.setName('limit').setDescription('عدد المعاملات (افتراضي: 10)').setRequired(false).setMinValue(1).setMaxValue(50)
  );

export async function execute(interaction) {
  const limit = interaction.options.getInteger('limit') || 10;
  const transactions = await Transaction.find({ userId: interaction.user.id })
    .sort({ timestamp: -1 })
    .limit(limit);

  let description = '';
  transactions.forEach((transaction, index) => {
    const date = new Date(transaction.timestamp).toLocaleDateString('ar-SA');
    const icon = transaction.type === 'buy' ? '📈' : transaction.type === 'sell' ? '📉' : 
                 transaction.type === 'transfer' ? '📤' : transaction.type === 'daily' ? '🎁' :
                 transaction.type === 'game' ? '🎮' : '⚙️';
    
    description += `${index + 1}. ${icon} **${transaction.description}**\n`;
    description += `   💰 ${transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()} 🏆 | ${date}\n\n`;
  });

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('📋 سجل المعاملات')
    .setDescription(description || 'لا توجد معاملات')
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
