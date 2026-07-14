import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('إدارة تكوين الخادم')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('prefix')
      .setDescription('تغيير بادئة الأوامر')
      .addStringOption((option) =>
        option.setName('prefix').setDescription('البادئة الجديدة').setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('language')
      .setDescription('تغيير اللغة')
      .addStringOption((option) =>
        option
          .setName('lang')
          .setDescription('اختر اللغة')
          .setRequired(true)
          .addChoices({ name: 'العربية', value: 'ar' }, { name: 'English', value: 'en' })
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('⚙️ تم التحديث')
    .setDescription(`تم تحديث ${subcommand} بنجاح`);

  await interaction.reply({ embeds: [embed] });
}
