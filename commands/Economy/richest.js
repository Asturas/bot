import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';

export const data = new SlashCommandBuilder()
  .setName('richest')
  .setDescription('عرض أغنى 10 لاعبين');

export async function execute(interaction) {
  const topUsers = await User.find()
    .sort({ balance: -1 })
    .limit(10);

  let description = '';
  topUsers.forEach((user, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    description += `${medal} **${user.username}** - ${user.balance.toLocaleString()} 🏆\n`;
  });

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('💎 أغنى 10 لاعبين')
    .setDescription(description)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
