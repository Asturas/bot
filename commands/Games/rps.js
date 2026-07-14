import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '../../utils/economy.js';
import { playRockPaperScissors } from '../../utils/games.js';

export const data = new SlashCommandBuilder()
  .setName('rps')
  .setDescription('لعبة ورقة حجرة مقص')
  .addStringOption((option) =>
    option
      .setName('choice')
      .setDescription('اختيارك')
      .setRequired(true)
      .addChoices(
        { name: '🪨 حجر', value: '🪨 حجر' },
        { name: '📄 ورقة', value: '📄 ورقة' },
        { name: '✂️ مقص', value: '✂️ مقص' }
      )
  )
  .addIntegerOption((option) =>
    option.setName('bet').setDescription('رهانك').setRequired(true).setMinValue(10)
  );

export async function execute(interaction) {
  const choice = interaction.options.getString('choice');
  const bet = interaction.options.getInteger('bet');
  const user = await getOrCreateUser(interaction.user.id, interaction.user.username);

  if (user.balance < bet) {
    return await interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد كافي!')],
      ephemeral: true,
    });
  }

  const { result, botChoice, winAmount } = await playRockPaperScissors(interaction.user.id, choice, bet);

  let color = '#FFD700';
  let title = '⚖️ تعادل';
  let description = `🤖 اختيار البوت: ${botChoice}\n👤 اختيارك: ${choice}`;

  if (result === 'win') {
    color = '#00FF00';
    title = '🎉 فزت!';
    description += `\n💰 ربحت ${winAmount} 🪙`;
  } else if (result === 'lose') {
    color = '#FF0000';
    title = '😢 خسرت';
    description += `\n💸 خسرت ${bet} 🪙`;
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
