import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('create-ticket')
  .setDescription('إنشاء قناة دعم (تذكرة)');

export async function execute(interaction) {
  const button = new ButtonBuilder()
    .setCustomId('create_ticket')
    .setLabel('إنشاء تذكرة')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('🎫');

  const row = new ActionRowBuilder().addComponents(button);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('🎫 نظام التذاكر')
    .setDescription('اضغط على الزر أدناه لإنشاء تذكرة دعم')
    .setThumbnail(interaction.guild.iconURL())
    .addFields(
      { name: '📌 المعلومات', value: 'سيتم فتح قناة خاصة بينك وبين فريق الدعم' }
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}
