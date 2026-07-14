import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('unmute')
  .setDescription('إلغاء إسكات عضو')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('المستخدم').setRequired(true)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user');

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('🔊 تم إلغاء الإسكات')
    .setDescription(`تم إلغاء إسكات ${user.tag}`);

  await interaction.reply({ embeds: [embed] });
}
