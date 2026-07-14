import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getOrCreateUser, addBalance } from '../../utils/economy.js';
import Transaction from '../../models/Transaction.js';

export const data = new SlashCommandBuilder()
  .setName('addmoney')
  .setDescription('إضافة أموال لمستخدم (أدمن فقط)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('السبب').setRequired(false)
  );

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user');
  const amount = interaction.options.getInteger('amount');
  const reason = interaction.options.getString('reason') || 'لم يتم تحديد السبب';

  await getOrCreateUser(targetUser.id, targetUser.username);
  await addBalance(targetUser.id, amount);

  await new Transaction({
    userId: targetUser.id,
    type: 'admin',
    amount,
    description: `إضافة من قبل الأدمن - السبب: ${reason}`,
  }).save();

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('✅ تم إضافة الأموال')
    .addFields(
      { name: '👤 المستخدم', value: targetUser.tag, inline: true },
      { name: '💰 المبلغ', value: `${amount} 🪙`, inline: true },
      { name: '📝 السبب', value: reason, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
