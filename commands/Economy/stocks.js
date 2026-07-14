import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Stock from '../../models/Stock.js';
import { getOrCreateUser, buyStock, sellStock } from '../../utils/economy.js';

export const data = new SlashCommandBuilder()
  .setName('stocks')
  .setDescription('إدارة الأسهم')
  .addSubcommand((subcommand) =>
    subcommand.setName('list').setDescription('عرض قائمة الأسهم المتاحة')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('buy')
      .setDescription('شراء أسهم')
      .addStringOption((option) =>
        option.setName('stock').setDescription('معرّف السهم').setRequired(true)
      )
      .addIntegerOption((option) =>
        option.setName('shares').setDescription('عدد الأسهم').setRequired(true).setMinValue(1)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('sell')
      .setDescription('بيع أسهم')
      .addStringOption((option) =>
        option.setName('stock').setDescription('معرّف السهم').setRequired(true)
      )
      .addIntegerOption((option) =>
        option.setName('shares').setDescription('عدد الأسهم').setRequired(true).setMinValue(1)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('portfolio').setDescription('عرض محفظتك')
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const user = await getOrCreateUser(interaction.user.id, interaction.user.username);

  if (subcommand === 'list') {
    const stocks = await Stock.find();
    
    let description = '';
    stocks.forEach((stock) => {
      const change = stock.changePercent >= 0 ? '📈' : '📉';
      description += `${stock.emoji} **${stock.name}** (${stock.stockId})\n`;
      description += `💰 ${stock.currentPrice} 🪙 ${change} ${stock.changePercent.toFixed(2)}%\n\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 قائمة الأسهم')
      .setDescription(description || 'لا توجد أسهم متاحة')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === 'buy') {
    const stockId = interaction.options.getString('stock');
    const shares = interaction.options.getInteger('shares');
    const stock = await Stock.findOne({ stockId });

    if (!stock) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ السهم غير موجود!')],
        ephemeral: true,
      });
    }

    const totalCost = stock.currentPrice * shares;
    if (user.balance < totalCost) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك رصيد كافي!')],
        ephemeral: true,
      });
    }

    await buyStock(interaction.user.id, stockId, shares);
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ شراء ناجح')
      .addFields(
        { name: '📊 السهم', value: stock.name, inline: true },
        { name: '📈 العدد', value: `${shares}`, inline: true },
        { name: '💰 السعر الإجمالي', value: `${totalCost} 🪙`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === 'sell') {
    const stockId = interaction.options.getString('stock');
    const shares = interaction.options.getInteger('shares');
    const stock = await Stock.findOne({ stockId });

    if (!stock) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ السهم غير موجود!')],
        ephemeral: true,
      });
    }

    const userStock = user.portfolio.find((s) => s.stockId === stockId);
    if (!userStock || userStock.shares < shares) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ ليس لديك عدد أسهم كافي!')],
        ephemeral: true,
      });
    }

    await sellStock(interaction.user.id, stockId, shares);
    const totalValue = stock.currentPrice * shares;

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ بيع ناجح')
      .addFields(
        { name: '📊 السهم', value: stock.name, inline: true },
        { name: '📈 العدد', value: `${shares}`, inline: true },
        { name: '💰 السعر الإجمالي', value: `${totalValue} 🪙`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === 'portfolio') {
    let description = '';
    let totalValue = 0;

    for (const stock of user.portfolio) {
      const stockData = await Stock.findOne({ stockId: stock.stockId });
      if (stockData) {
        const value = stockData.currentPrice * stock.shares;
        totalValue += value;
        description += `${stockData.emoji} **${stockData.name}**\n`;
        description += `📈 ${stock.shares} سهم @ ${stockData.currentPrice} 🪙\n`;
        description += `💰 القيمة الحالية: ${value} 🪙\n\n`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 محفظتك')
      .setDescription(description || 'المحفظة فارغة')
      .addFields({ name: '💎 إجمالي القيمة', value: `${totalValue} 🪙`, inline: true })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}
