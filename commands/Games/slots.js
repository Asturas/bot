import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '../../utils/economy.js';
import { playSlots } from '../../utils/games.js';

export const data = new SlashCommandBuilder()
  .setName('slots')
  .setDescription('لعبة الماكينة - السلوتس')
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

  const { reels, result, winAmount } = await playSlots(interaction.user.id, bet);

  let color = result === 'lose' ? '#FF0000' : '#00FF00';
  let title = result === 'jackpot' ? '🎰 جاكبوت!' : result === 'win' ? '🎉 فزت!' : '😢 خسرت';
  let description = `${reels[0]} | ${reels[1]} | ${reels[2]}\n\n`;
  
  if (result === 'jackpot') {
    description += `🤑 **جاكبوت!** ربحت ${winAmount} 🪙`;
  } else if (result === 'win') {
    description += `💰 ربحت ${winAmount} 🪙`;
  } else {
    description += `💸 خسرت ${bet} 🪙`;
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
