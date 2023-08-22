import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ranking")
  .setDescription("Classement par temps dans le vocal");

export async function execute(interaction: CommandInteraction) {
  console.log(interaction.user.username);
    // Show the modal to the user
  // await interaction.showModal(modal);
  return interaction.reply("Pong! 5");
}
