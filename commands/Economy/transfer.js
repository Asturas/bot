import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser, transferMoney } from '../../utils/economy.js';
import Transaction from '../../models/Transaction.js';

export const data = new SlashCommandBuilder()
  .setName('transfer')
  .setDescription('تحويل أموال إلى مستخدم آخر')
  .addUserOption((option) =>
    option.setName('user').setDescription('المستقبل').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)
  )
  .addStringOption((option) =>
    option.setName('message').setDescription('رسالة (اختياري)').setRequired(false)
  );

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user');
  const amount = interaction.options.getInteger('amount');
  const message = interaction.options.getString('message') || 'بدون رسالة';

  if (targetUser.id === interaction.user.id) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ لا يمكنك تحويل أموال لنفسك!')],
      ephemeral: true,
    });
  }

  const fromUser = await getOrCreateUser(interaction.user.id, interaction.user.username);
  
  if (fromUser.balance < amount) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد كافي!')],
      ephemeral: true,
    });
  }

  const success = await transferMoney(interaction.user.id, targetUser.id, amount);

  if (!success) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ حدث خطأ في التحويل!')],
      ephemeral: true,
    });
  }

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('✅ تحويل نجح')
    .addFields(
      { name: '📤 من', value: interaction.user.tag, inline: true },
      { name: '📥 إلى', value: targetUser.tag, inline: true },
      { name: '💰 المبلغ', value: `${amount.toLocaleString()} 🏆`, inline: true },
      { name: '💬 الرسالة', value: message, inline: false }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
