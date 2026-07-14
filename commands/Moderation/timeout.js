import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('حجب عضو عن الكتابة')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('duration').setDescription('المدة بالدقائق').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('السبب').setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const duration = interaction.options.getInteger('duration');
  const reason = interaction.options.getString('reason') || 'لم يتم تحديد السبب';

  const embed = new EmbedBuilder()
    .setColor('#9C27B0')
    .setTitle('⏱️ تم الحجب')
    .setDescription(`تم حجب ${user.tag} لمدة ${duration} دقيقة`)
    .addFields(
      { name: '👤 المستخدم', value: user.tag, inline: true },
      { name: '⏰ المدة', value: `${duration} دقيقة`, inline: true },
      { name: '📝 السبب', value: reason, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
