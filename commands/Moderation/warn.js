import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('إعطاء تحذير لعضو')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('السبب').setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'لم يتم تحديد السبب';

  const embed = new EmbedBuilder()
    .setColor('#FFFF00')
    .setTitle('⚠️ تحذير')
    .setDescription(`تم تحذير ${user.tag}`)
    .addFields(
      { name: '👤 المستخدم', value: user.tag, inline: true },
      { name: '📝 السبب', value: reason, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
