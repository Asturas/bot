import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('اعرض قائمة المساعدة والأوامر المتاحة');

export async function execute(interaction) {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('help_menu')
    .setPlaceholder('اختر فئة للمزيد من المعلومات')
    .addOptions([
      {
        label: 'Leveling',
        value: 'leveling',
        description: 'أوامر النقاط والمستويات',
        emoji: '📊',
      },
      {
        label: 'Admin',
        value: 'admin',
        description: 'أوامر الإدارة والتعديل',
        emoji: '⚙️',
      },
      {
        label: 'Moderation',
        value: 'moderation',
        description: 'أوامر الإشراف',
        emoji: '🛡️',
      },
      {
        label: 'Tickets',
        value: 'tickets',
        description: 'نظام التذاكر',
        emoji: '🎫',
      },
    ]);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('📖 دليل البوت')
    .setDescription('اختر فئة من القائمة أدناه لترى الأوامر المتاحة')
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .addFields(
      { name: '📊 Leveling', value: 'أوامر النقاط والمستويات (2 أوامر)', inline: true },
      { name: '⚙️ Admin', value: 'أوامر الإدارة (2 أوامر)', inline: true },
      { name: '🛡️ Moderation', value: 'أوامر الإشراف (9 أوامر)', inline: true },
      { name: '🎫 Tickets', value: 'نظام التذاكر (2 أوامر)', inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], components: [row] });
}
