import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '../../utils/economy.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('عرض رصيدك الحالي')
  .addUserOption((option) =>
    option.setName('user').setDescription('اختر مستخدم (اختياري)').setRequired(false)
  );

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const user = await getOrCreateUser(targetUser.id, targetUser.username);

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle(`💰 رصيد ${targetUser.username}`)
    .setThumbnail(targetUser.displayAvatarURL())
    .addFields(
      { name: '👜 المحفظة', value: `${user.balance.toLocaleString()} 🪙`, inline: true },
      { name: '🏦 البنك', value: `${user.bank.toLocaleString()} 🪙`, inline: true },
      { name: '💎 الإجمالي', value: `${(user.balance + user.bank).toLocaleString()} 🪙`, inline: true },
      { name: '📈 الأسهم', value: user.portfolio.length > 0 ? `${user.portfolio.length} سهم` : 'لا توجد أسهم', inline: true },
      { name: '📦 المخزون', value: user.inventory.length > 0 ? `${user.inventory.length} عنصر` : 'المخزون فارغ', inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
