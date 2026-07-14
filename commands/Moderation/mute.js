import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('إسكات عضو')
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
    .setColor('#808080')
    .setTitle('🔇 تم الإسكات')
    .setDescription(`تم إسكات ${user.tag}`)
    .addFields(
      { name: '👤 المستخدم', value: user.tag, inline: true },
      { name: '📝 السبب', value: reason, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
