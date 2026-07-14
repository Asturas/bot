import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('حظر عضو من الخادم')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم المراد حظره').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('سبب الحظر').setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'لم يتم تحديد السبب';

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('🚫 تم الحظر')
    .setDescription(`تم حظر ${user.tag}`)
    .addFields(
      { name: '👤 المستخدم', value: user.tag, inline: true },
      { name: '📝 السبب', value: reason, inline: true },
      { name: '⏰ الوقت', value: new Date().toLocaleString('ar-SA'), inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
