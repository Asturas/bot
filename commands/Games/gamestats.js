import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getOrCreateGameStats } from '../../utils/games.js';

export const data = new SlashCommandBuilder()
  .setName('gamestats')
  .setDescription('عرض إحصائيات اللعب الخاصة بك')
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم (اختياري)').setRequired(false)
  );

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const stats = await getOrCreateGameStats(targetUser.id);

  const winRatioRPS = stats.rockPaperScissorsWins + stats.rockPaperScissorsLosses > 0 
    ? (stats.rockPaperScissorsWins / (stats.rockPaperScissorsWins + stats.rockPaperScissorsLosses) * 100).toFixed(1)
    : 0;

  const winRatioDice = stats.diceWins + stats.diceLosses > 0
    ? (stats.diceWins / (stats.diceWins + stats.diceLosses) * 100).toFixed(1)
    : 0;

  const winRatioBlackjack = stats.blackjackWins + stats.blackjackLosses > 0
    ? (stats.blackjackWins / (stats.blackjackWins + stats.blackjackLosses) * 100).toFixed(1)
    : 0;

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`📊 إحصائيات اللعب - ${targetUser.username}`)
    .setThumbnail(targetUser.displayAvatarURL())
    .addFields(
      { name: '🎮 إجمالي الألعاب', value: `${stats.totalGamesPlayed}`, inline: true },
      { name: '💰 إجمالي الأرباح', value: `${stats.totalGameWinnings.toLocaleString()} 🏆`, inline: true },
      { name: '\u200b', value: '\u200b', inline: true },
      { name: '🪨 ورقة حجرة مقص', value: `الفوز: ${stats.rockPaperScissorsWins} | الخسارة: ${stats.rockPaperScissorsLosses} | نسبة الفوز: ${winRatioRPS}%`, inline: false },
      { name: '🎲 النرد', value: `الفوز: ${stats.diceWins} | الخسارة: ${stats.diceLosses} | نسبة الفوز: ${winRatioDice}%`, inline: false },
      { name: '🎰 السلوتس', value: `الدورات: ${stats.slotsSpins} | الفوز: ${stats.slotsWins}`, inline: false },
      { name: '🃏 بلاك جاك', value: `الفوز: ${stats.blackjackWins} | الخسارة: ${stats.blackjackLosses} | نسبة الفوز: ${winRatioBlackjack}%`, inline: false }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
