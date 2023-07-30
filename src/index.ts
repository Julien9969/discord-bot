import { Client, Events, IntentsBitField, GatewayIntentBits, ActivityType, ButtonInteraction } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { createRoleButtons } from "./messages/roles-messages";
// import { Authenticator } from "./GPT-token/token-gpt";
import { getToken } from "./GPT-token/token-pyFile";

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

  getToken();
  
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`Joined a new guild: ${guild.name}!`);
  // resiter here when bot is over
});

client.on("interactionCreate", async (interaction: any) => {
  try {
    if (interaction.customId === "stop-button") {
      return;
    }
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
      }
      return;
    }

  } catch (error) {
    (interaction as ButtonInteraction).editReply({content: "Une erreur est survenue"});
    console.log("error : ", error);
  }
});

client.login(config.TOKEN);