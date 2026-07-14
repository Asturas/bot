import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '../../utils/economy.js';
import { playBlackjack } from '../../utils/games.js';

export const data = new SlashCommandBuilder()
  .setName('blackjack')
  .setDescription('لعبة بلاك جاك')
  .addIntegerOption((option) =>
    option.setName('bet').setDescription('رهانك').setRequired(true).setMinValue(10)
  );

export async function execute(interaction) {
  const bet = interaction.options.getInteger('bet');
  const user = await getOrCreateUser(interaction.user.id, interaction.user.username);

  if (user.balance < bet) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد كافي!')],
      ephemeral: true,
    });
  }

  const { result, winAmount } = await playBlackjack(interaction.user.id, bet);

  let color = result === 'win' ? '#00FF00' : '#FF0000';
  let title = result === 'win' ? '🎉 فزت!' : '😢 خسرت';
  let description = result === 'win' ? `💰 ربحت ${winAmount} 🪙` : `💸 خسرت ${bet} 🪙`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
