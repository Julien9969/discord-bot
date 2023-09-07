import { Client, Events, IntentsBitField, GatewayIntentBits, ActivityType, ButtonInteraction } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { modalProcess } from "./commands/gpt";
import { createRoleButtons } from "./messages/roles-messages";
// import { Authenticator } from "./GPT-token/token-gpt";
import { getToken } from "./GPT-token/token-pyFile";
import * as fs from "fs";
import { RoleMessageData } from "./interface/role-message-data";
import { achievement } from "./achievement";

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
  client.guilds.cache.forEach(async (guild) => {
    await deployCommands({ guildId: guild.id });
    console.log(`Joined a new guild: ${guild.name}!`);
  });

  client.user?.setActivity("Démonter sa tente", { 
    type: ActivityType.Streaming,
    name: "Démonter sa tente",
    url: "https://www.youtube.com/watch?v=uO8SeXh_LaA"
  });
  
  createRoleButtons(c);
  // getToken();
  achievement(c);
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`Joined a new guild: ${guild.name}!`);
  await deployCommands({ guildId: guild.id });
  // regidter here when bot is over
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "promptGPTmodal") {
    await interaction.reply({ content: "Your submission was received successfully!" });
    modalProcess(interaction);
  }
});

client.on(Events.MessageDelete, (deletedMessage) => {
  if (deletedMessage.components) {
    console.log("Roles menu deleted");
    const rolesMessages = JSON.parse(fs.readFileSync("./src/messages/roles-messages.json").toString()) as RoleMessageData[];
    const index = rolesMessages.findIndex((roleMessage) => roleMessage.messageId === deletedMessage.id);
    rolesMessages.splice(index, 1);
    fs.writeFileSync("./src/messages/roles-messages.json", JSON.stringify(rolesMessages, null, 4));
  }
});


client.login(config.TOKEN);

export { client };