import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('close-ticket')
  .setDescription('إغلاق التذكرة')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('❌ تم إغلاق التذكرة')
    .setDescription('تم إغلاق التذكرة بنجاح')
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
