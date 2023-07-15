import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dm")
  .setDescription("dm @user")
  .addStringOption((option) =>
    option.setName("user")
        .setDescription("The user to dm")
        .setRequired(true));

export async function execute(interaction: CommandInteraction) {
    const userToDM = interaction.options.get("user");
    // Check if the option is provided
    if (!userToDM || !userToDM.value) {
        await interaction.reply("Please provide a user to DM.");
        return;
    }

    // console.log("userToDM : ", userToDM.value);
    // const targetUser = interaction.client.users.cache.get(userToDM.value as string);
    // console.log("targetUser : ", targetUser);

    const stopButton = new ButtonBuilder()
    .setCustomId("plus-dix")
    .setLabel("+ 10 msg")
    .setStyle(ButtonStyle.Success)
    .setEmoji("🫡");

    const userId = (userToDM.value as string).replace(/<@|>/g, "");

    // Find the user by their ID
    const targetUser = interaction.client.users.cache.get(userId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: any = new ActionRowBuilder()
    .addComponents(stopButton);
    // Now you can use the "userToDM" variable as the user's input.
    // For example, you can attempt to send a DM to the user:
    setTimeout(async () => {
        await interaction.editReply({ content: "Arrêt automatique", components: [] });
    }, 20_000);

    let count = 1;
    try {
        await targetUser?.send(`Hello, you wanted to DM: ${JSON.stringify(userToDM)}`);      
        
        const rep = await interaction.reply({
            content: "DM sent successfully!",
            components: [row],
        });

        const collector = rep?.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === interaction.user.id,
        });

        collector.on("collect", async (i) => {
            if (i.customId === "plus-dix") {
                count += 10;
                await i.update({ content: `${count} DM are send`, components: [row]});
                for (let index = 0; index < 10; index++) {
                    console.log("index : ", index);
                    await targetUser?.send(`Hello, you wanted to DM: ${JSON.stringify(userToDM)}`);
                }
            }
        });
        
    } catch (error) {
        await interaction.reply("Failed to send a DM. ");
    }
}
