import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '../../utils/economy.js';

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('عرض مخزونك')
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم (اختياري)').setRequired(false)
  );

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const user = await getOrCreateUser(targetUser.id, targetUser.username);

  let description = '';
  if (user.inventory.length === 0) {
    description = '📦 المخزن فارغ';
  } else {
    user.inventory.forEach((item, index) => {
      description += `${index + 1}. **${item.itemId}**\n`;
      description += `   الكمية: ${item.quantity} | السعر: ${item.currentPrice} 🏆\n\n`;
    });
  }

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`📦 مخزن ${targetUser.username}`)
    .setDescription(description)
    .setThumbnail(targetUser.displayAvatarURL())
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
