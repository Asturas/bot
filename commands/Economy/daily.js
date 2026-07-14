import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser, addBalance } from '../../utils/economy.js';
import Transaction from '../../models/Transaction.js';

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('احصل على مكافأة يومية');

export async function execute(interaction) {
  const user = await getOrCreateUser(interaction.user.id, interaction.user.username);
  const now = new Date();
  const lastDaily = user.lastDaily ? new Date(user.lastDaily) : null;
  
  // Check if already claimed today
  if (lastDaily && now.toDateString() === lastDaily.toDateString()) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('❌ لقد حصلت على مكافأتك اليومية بالفعل! عُد غداً.');
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // Calculate streak and bonus
  let streak = user.dailyStreak || 0;
  if (lastDaily && (now - lastDaily) / (1000 * 60 * 60) <= 25) {
    streak += 1;
  } else {
    streak = 1;
  }

  const baseReward = 500;
  const streakBonus = streak * 50;
  const totalReward = baseReward + streakBonus;

  user.balance += totalReward;
  user.dailyStreak = streak;
  user.lastDaily = now;
  await user.save();

  await new Transaction({
    userId: interaction.user.id,
    type: 'daily',
    amount: totalReward,
    description: `مكافأة يومية (يوم ${streak})`,
  }).save();

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('🎁 مكافأتك اليومية')
    .addFields(
      { name: '💵 المكافأة الأساسية', value: `${baseReward} 🪙`, inline: true },
      { name: '🔥 مكافأة التسلسل', value: `${streakBonus} 🪙`, inline: true },
      { name: '✨ الإجمالي', value: `${totalReward} 🪙`, inline: true },
      { name: '📅 التسلسل الحالي', value: `${streak} يوم`, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
