import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('طرد عضو من الخادم')
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم المراد طرده').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('سبب الطرد').setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'لم يتم تحديد السبب';

  const embed = new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('👢 تم الطرد')
    .setDescription(`تم طرد ${user.tag}`)
    .addFields(
      { name: '👤 المستخدم', value: user.tag, inline: true },
      { name: '📝 السبب', value: reason, inline: true },
      { name: '⏰ الوقت', value: new Date().toLocaleString('ar-SA'), inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
