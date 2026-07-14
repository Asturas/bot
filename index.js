import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();
client.events = new Collection();

// Load Commands
async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  const commandFolders = readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(commandsPath, folder)).filter(
      (file) => file.endsWith('.js')
    );

    for (const file of commandFiles) {
      const filePath = join(commandsPath, folder, file);
      const command = await import(`file://${filePath}`);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      }
    }
  }

  console.log(`✅ تم تحميل ${client.commands.size} أوامر`);
}

// Load Events
async function loadEvents() {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(`file://${filePath}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log(`✅ تم تحميل ${eventFiles.length} أحداث`);
}

// Initialize Bot
async function initialize() {
  try {
    await loadCommands();
    await loadEvents();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ خطأ في تحميل البوت:', error);
    process.exit(1);
  }
}

initialize();
