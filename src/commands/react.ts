import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("react")
  .setDescription("Réagis à un message");

export async function execute(interaction: CommandInteraction) {
  const channel = interaction.channel;

    if (!channel) {
        interaction.reply("Problème pour recup le channel");
        return;
    }
    try {
    const messages = await channel.messages.fetch({ limit: 2 });

    const latestMessage = messages.first();
    messages.forEach((message) => {
        console.log(message.content);
        message.react("👍");
    });
    if (!latestMessage) {
        interaction.reply("Problème pour recup le dernier message");
        return;
    }
    await latestMessage.react("👍");
    } catch (error) {
        interaction.reply("Problème pour réagir au dernier message");
        return;
    }
  
    return interaction.reply("C bon");
}