import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser, depositToBank, withdrawFromBank } from '../../utils/economy.js';

export const data = new SlashCommandBuilder()
  .setName('bank')
  .setDescription('إدارة حسابك البنكي')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('deposit')
      .setDescription('إيداع أموال إلى البنك')
      .addIntegerOption((option) =>
        option.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('withdraw')
      .setDescription('سحب أموال من البنك')
      .addIntegerOption((option) =>
        option.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('status').setDescription('عرض حالة حسابك البنكي')
  );

export async function execute(interaction) {
  const user = await getOrCreateUser(interaction.user.id, interaction.user.username);
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'deposit') {
    const amount = interaction.options.getInteger('amount');
    
    if (user.balance < amount) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد كافي!')],
        ephemeral: true,
      });
    }

    await depositToBank(interaction.user.id, amount);
    const updatedUser = await getOrCreateUser(interaction.user.id, interaction.user.username);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ إيداع ناجح')
      .addFields(
        { name: '💵 المبلغ', value: `${amount} 🪙`, inline: true },
        { name: '👜 رصيدك الجديد', value: `${updatedUser.balance} 🪙`, inline: true },
        { name: '🏦 رصيد البنك', value: `${updatedUser.bank} 🪙`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === 'withdraw') {
    const amount = interaction.options.getInteger('amount');
    
    if (user.bank < amount) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد في البنك!')],
        ephemeral: true,
      });
    }

    await withdrawFromBank(interaction.user.id, amount);
    const updatedUser = await getOrCreateUser(interaction.user.id, interaction.user.username);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ سحب ناجح')
      .addFields(
        { name: '💵 المبلغ', value: `${amount} 🪙`, inline: true },
        { name: '👜 رصيدك الجديد', value: `${updatedUser.balance} 🪙`, inline: true },
        { name: '🏦 رصيد البنك', value: `${updatedUser.bank} 🪙`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === 'status') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🏦 حالة حسابك البنكي')
      .addFields(
        { name: '👜 المحفظة', value: `${user.balance} 🪙`, inline: true },
        { name: '🏦 البنك', value: `${user.bank} 🪙`, inline: true },
        { name: '💎 الإجمالي', value: `${user.balance + user.bank} 🪙`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
}
