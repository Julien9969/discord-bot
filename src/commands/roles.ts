import { CommandInteraction, SlashCommandBuilder, PermissionsBitField, Client, IntentsBitField, Events  } from "discord.js";
import { RolesButtonData } from "../interface/roles-button-data";
import * as fs from "fs";
import { createRoleButtons } from "../messages/roles-messages";
import { config } from "../config";

export const data = new SlashCommandBuilder()
  .setName("roles")
  .setDescription("Create roles buttons")
  .addStringOption((option) =>
option.setName("roles1")
    .setDescription("1er role")
    .setRequired(true))
.addStringOption((option) =>
option.setName("emoji1")
    .setDescription("1er emoji")
    .setRequired(false));

for (let i = 2; i <= 5; i++) {
  data.addStringOption((option) => 
    option.setName(`roles${i}`)
      .setDescription(`${i}e role`)
      .setRequired(false))
  .addStringOption((option) =>
    option.setName(`emoji${i}`)
      .setDescription(`${i}e emoji`)
      .setRequired(false));
}
   

export async function execute(interaction: CommandInteraction) {
  await interaction.reply({ content: "Création du menu", ephemeral: true });

  // console.log(interaction.guildId);
  // console.log(interaction.channelId);

  // const channel = interaction.guild?.channels.cache.get(interaction.channelId);
  // if (channel && channel.type === ChannelType.GuildText) {
  //   channel.send("Hello, this is a message from the bot!");
  // }

  const member = interaction.guild?.members.cache.get(interaction.user.id);

  if (!(member?.permissions.has(PermissionsBitField.Flags.Administrator)))
    return await interaction.editReply("Tu n'as pas les droits pour faire ça");

  const rolesToCreate: RolesButtonData[] = [];

  const rolesEntered =  interaction.options.data.filter((d) => d.name.startsWith("roles"));
  console.log(rolesEntered);

  let notFound = "Roles non trouvés :\n";
  rolesEntered.forEach(async (role) => {
    
    const roleObj = interaction.guild?.roles.cache.find((r) => r.name === role.value);
    if (!roleObj) {
      notFound += `${role.value}\n`;
      await interaction.editReply({content: notFound});
      return;
    }
    
    
    const emoji = interaction.options.data.find((d) => d.name === `emoji${role.name[role.name.length - 1]}`);
    if (!(/\p{Extended_Pictographic}/u.test(emoji?.value as string))) {
      console.log("emoji invalide: " + emoji?.value);
      rolesToCreate.push({id: roleObj.id, name: roleObj.name });
      return;
    }
    rolesToCreate.push({id: roleObj.id, name: roleObj.name, emoji: emoji?.value as string });
  });

  console.log("role: ", rolesToCreate);
  if (rolesToCreate.length === 0) {
    await interaction.editReply({content: "Aucun rôle correspondant trouvé"});
    return;
  }
  
  const message = await interaction.channel?.send({content: "Roles buttons"});
  
  // Read the JSON file
  const rawData = fs.readFileSync("./src/messages/roles-messages.json");
  const data = JSON.parse(rawData.toString());
  
  data.push({ guildId: interaction.guildId, channelId: interaction.channelId, messageId: message?.id, roles: rolesToCreate });
  
  fs.writeFileSync("./src/messages/roles-messages.json", JSON.stringify(data, null, 4));

  setTimeout(async () => {
    await interaction.deleteReply();
  }, 2000);

  callCreateRoleButtons();
}


function callCreateRoleButtons() {
  const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.MessageContent,
  ] });
  client.login(config.TOKEN);

  client.on(Events.ClientReady, () => {
    createRoleButtons(client);
  });
}