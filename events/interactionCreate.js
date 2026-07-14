export const name = 'interactionCreate';

export async function execute(interaction, client) {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ حدث خطأ أثناء تنفيذ الأمر!',
        ephemeral: true,
      });
    }
  }
}
