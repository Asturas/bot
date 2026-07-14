import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '../../utils/economy.js';
import { playDice } from '../../utils/games.js';

export const data = new SlashCommandBuilder()
  .setName('dice')
  .setDescription('لعبة النرد')
  .addStringOption((option) =>
    option
      .setName('prediction')
      .setDescription('توقعك')
      .setRequired(true)
      .addChoices(
        { name: 'عالي (4-6)', value: 'high' },
        { name: 'منخفض (1-3)', value: 'low' },
        { name: 'زوجي', value: 'even' },
        { name: 'فردي', value: 'odd' }
      )
  )
  .addIntegerOption((option) =>
    option.setName('bet').setDescription('رهانك').setRequired(true).setMinValue(10)
  );

export async function execute(interaction) {
  const prediction = interaction.options.getString('prediction');
  const bet = interaction.options.getInteger('bet');
  const user = await getOrCreateUser(interaction.user.id, interaction.user.username);

  if (user.balance < bet) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد كافي!')],
      ephemeral: true,
    });
  }

  const { roll, result, winAmount } = await playDice(interaction.user.id, bet, prediction);

  let color = result === 'win' ? '#00FF00' : '#FF0000';
  let title = result === 'win' ? '🎉 فزت!' : '😢 خسرت';
  let description = `🎲 نتيجة النرد: **${roll}**\n`;
  description += `🎯 توقعك: ${prediction}\n`;
  description += result === 'win' ? `💰 ربحت ${winAmount} 🪙` : `💸 خسرت ${bet} 🪙`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
