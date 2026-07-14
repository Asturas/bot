import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('إعداد إعدادات البوت')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('✅ تم إعداد البوت')
    .setDescription('تم تكوين جميع إعدادات البوت بنجاح')
    .addFields(
      { name: '🎉 رسالة الترحيب', value: 'تم تفعيلها', inline: true },
      { name: '👋 رسالة الوداع', value: 'تم تفعيلها', inline: true },
      { name: '🎭 دور تلقائي', value: 'تم تفعيله', inline: true },
      { name: '📋 السجلات', value: 'تم تفعيلها', inline: true },
      { name: '🎫 التذاكر', value: 'تم تفعيلها', inline: true },
      { name: '📊 النقاط', value: 'تم تفعيلها', inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
