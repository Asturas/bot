import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('level')
  .setDescription('عرض مستوى اللاعب الخاص بك');

export async function execute(interaction) {
  const user = interaction.user;
  const level = Math.floor(Math.random() * 100) + 1;
  const xp = Math.floor(Math.random() * 10000) + 1;
  const maxXp = 10000;

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`🎮 مستوى ${user.username}`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: '📊 المستوى', value: `${level}`, inline: true },
      { name: '⭐ الخبرة', value: `${xp}/${maxXp}`, inline: true },
      { name: '📈 التقدم', value: `${Math.round((xp / maxXp) * 100)}%`, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
