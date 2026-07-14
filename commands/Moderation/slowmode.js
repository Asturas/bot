import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('slowmode')
  .setDescription('تفعيل الوضع البطيء')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addIntegerOption((option) =>
    option.setName('seconds').setDescription('الثواني').setRequired(true).setMinValue(0).setMaxValue(21600)
  );

export async function execute(interaction) {
  const seconds = interaction.options.getInteger('seconds');

  const embed = new EmbedBuilder()
    .setColor('#3498db')
    .setTitle('🐌 الوضع البطيء')
    .setDescription(`تم تفعيل الوضع البطيء بـ ${seconds} ثانية`);

  await interaction.reply({ embeds: [embed] });
}
