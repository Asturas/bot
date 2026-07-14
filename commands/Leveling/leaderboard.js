import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('عرض لوحة المتصدرين في الخادم');

export async function execute(interaction) {
  const users = [
    { name: 'لاعب 1', level: 100, xp: 9500 },
    { name: 'لاعب 2', level: 95, xp: 8200 },
    { name: 'لاعب 3', level: 89, xp: 7100 },
    { name: 'لاعب 4', level: 85, xp: 6500 },
    { name: 'لاعب 5', level: 80, xp: 5000 },
  ];

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('🏆 لوحة المتصدرين')
    .setDescription('أفضل 5 لاعبين في الخادم')
    .addFields(
      { name: '🥇 المركز الأول', value: `**${users[0].name}** - مستوى ${users[0].level}`, inline: false },
      { name: '🥈 المركز الثاني', value: `**${users[1].name}** - مستوى ${users[1].level}`, inline: false },
      { name: '🥉 المركز الثالث', value: `**${users[2].name}** - مستوى ${users[2].level}`, inline: false },
      { name: '4️⃣ المركز الرابع', value: `**${users[3].name}** - مستوى ${users[3].level}`, inline: false },
      { name: '5️⃣ المركز الخامس', value: `**${users[4].name}** - مستوى ${users[4].level}`, inline: false }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
