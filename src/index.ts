import { Client, Events, IntentsBitField, GatewayIntentBits, ActivityType } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { createRoleButtons } from "./messages/roles-messages";

const client = new Client({ intents: [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.MessageContent,
	GatewayIntentBits.GuildVoiceStates
] });


client.once(Events.ClientReady, async (c: Client<true>) => {
  console.log("Discord bot is ready! 🤖");
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("No guilds found");
    return;
  }
  await deployCommands({ guildId: guild.id });
  console.log(`Joined a new guild: ${guild.name}!`);

  client.user?.setActivity("Démonter sa tente", { 
    type: ActivityType.Streaming,
    name: "Démonter sa tente",
    url: "https://www.youtube.com/watch?v=uO8SeXh_LaA"
  });
  createRoleButtons(c);
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`Joined a new guild: ${guild.name}!`);
  // resiter here when bot is over
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.TOKEN);