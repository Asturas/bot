import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getOrCreateUser, removeBalance } from '../../utils/economy.js';
import Transaction from '../../models/Transaction.js';

export const data = new SlashCommandBuilder()
  .setName('removemoney')
  .setDescription('خصم أموال من مستخدم (أدمن فقط)')
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

  const user = await getOrCreateUser(targetUser.id, targetUser.username);
  
  if (user.balance < amount) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ المستخدم ليس لديه رصيد كافي!')],
      ephemeral: true,
    });
  }

  await removeBalance(targetUser.id, amount);

  await new Transaction({
    userId: targetUser.id,
    type: 'admin',
    amount: -amount,
    description: `خصم من قبل الأدمن - السبب: ${reason}`,
  }).save();

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('✅ تم خصم الأموال')
    .addFields(
      { name: '👤 المستخدم', value: targetUser.tag, inline: true },
      { name: '💰 الم��لغ', value: `${amount} 🪙`, inline: true },
      { name: '📝 السبب', value: reason, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
