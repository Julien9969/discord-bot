import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  console.log(interaction.user.username);
    // Show the modal to the user
  // await interaction.showModal(modal);
  return interaction.reply("Pong! 5");
}
