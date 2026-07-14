import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('حذف رسائل من القناة')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option.setName('amount').setDescription('عدد الرسائل').setRequired(true).setMinValue(1).setMaxValue(100)
  );

export async function execute(interaction) {
  const amount = interaction.options.getInteger('amount');

  const embed = new EmbedBuilder()
    .setColor('#FF6347')
    .setTitle('🗑️ تم حذف الرسائل')
    .setDescription(`تم حذف ${amount} رسالة من القناة`)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
