import { Client, Events, IntentsBitField, GatewayIntentBits, ActivityType, GuildMemberRoleManager, ButtonInteraction, Interaction, BaseInteraction } from "discord.js";
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

    if (interaction.isButton()) {
      
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.guild?.roles.cache.get(interaction.customId);
      console.log("role : ", role);
      if (!role) {
        interaction.editReply({content: "Role not found"});
        return;
      }

      const hasRole = (interaction.member?.roles as GuildMemberRoleManager).cache.has(role.id);
      console.log("hasRole : ", hasRole);
      if (hasRole) {
        await (interaction.member?.roles as GuildMemberRoleManager).remove(role);
        interaction.editReply({content: `Tu n'as plus le rôle ${role.name}`});
        return;
      }

      await (interaction.member?.roles as GuildMemberRoleManager).add(role);
      interaction.editReply({content: `Tu as maintenant le rôle ${role.name}`});
      if ((interaction.member?.roles as GuildMemberRoleManager).cache.has("1033459304071712819")) {
        await (interaction.member?.roles as GuildMemberRoleManager).remove("1033459304071712819");
      }
      return;
    }
  } catch (error) {
    (interaction as ButtonInteraction).editReply({content: "Une erreur est survenue"});
    console.log("error : ", error);
  }
});

client.login(config.TOKEN);