// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, IntentsBitField } from 'discord.js';
import dotenv from 'dotenv';
// Create a new client instance
// const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import { addSmiley, reveil } from './commands/slash-func.js';
dotenv.config();

const client = new Client({ intents: [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.MessageContent,
	GatewayIntentBits.GuildVoiceStates
] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	const guild = client.guilds.cache.first();
	registerSlashCommands(guild);
});

async function registerSlashCommands(guildo) {
	try {
		const guildId = guildo.commands.permissions.guildId;
		// console.log(guildId);
		const commands = [
			{
				name: 'hello',
				description: 'Say hello!',
			},
			{
				name: 'server',
				description: 'Get server info.',
			},
			{
				name: 'react',
				description: 'React to the latest message in the channel.',
			},
			{
				name: 'reveil',
				description: 'Reveil bilal',
			}

		// Add more commands here if needed
		];

		const guild = client.guilds.cache.get(guildId);
		if (!guild) return console.log(`Guild with ID ${guildId} not found.`);

		await guild.commands.set(commands);
		console.log('Slash commands registered successfully!');
	}
	catch (error) {
		console.error('Failed to register slash commands:', error);
	}
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'hello') {
		await interaction.reply('Bonjour! Je suis BilalBot!');
	}
	else if (commandName === 'server') {
		await interaction.reply('Server info.');
	}
	else if (commandName === 'react') {
		await addSmiley(interaction);
	}
	else if (commandName === 'reveil') {
		await reveil(interaction, commandName);
	}

});

// Event handler for when a message is received
client.on('messageCreate', (message) => {
	console.log(`Received message: ${message.content}`);
	// Check if the message starts with the command prefix
	if (message.content.startsWith('!hello')) {
		// Send a response
		message.channel.send('Hello, world!');
	}
});

// Login the bot using your bot token
client.login(process.env.TOKEN);
