/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
// import { oraPromise } from "ora";
import { config } from "../config";


export const data = new SlashCommandBuilder()
  .setName("gptv2")
  .setDescription("Ask GPT-3 to generate a text")
  .addStringOption((option) =>
    option.setName("prompt")
        .setDescription("GPT prompt")
        .setRequired(true));

export async function execute(interaction: CommandInteraction<CacheType>) {
    console.log(interaction.channelId); 
    if (interaction.channelId !== "1130252359927349280" && interaction.channelId !== "1129414570348384256") {
        return interaction.reply("Cette commande est disponible que dans le channel Chat-GPT");
    }

    if (config.authGPT === "") {
        return interaction.reply("Impossible de se connecter à l'API GPT-3");
    }

    const prompt = interaction.options.get("prompt");
    console.log("prompt : ", prompt?.value);
    
    await interaction.reply("Je réflechie...");
    
    const res = await askGPT(prompt?.value as string, interaction);

    const continueButton = new ButtonBuilder()
    .setCustomId("continue")
    .setLabel("Continuer La réponse")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("⏩");

    const newMessageButton = new ButtonBuilder()
    .setCustomId("newMessage")
    .setLabel("Continuer la conversation")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⚡");


    const row = new ActionRowBuilder();
    row.addComponents(continueButton, newMessageButton);
    
    return await interaction.editReply({content: res, components: [row] as any});
}

async function askGPT(prompt: string, i: CommandInteraction<CacheType>) {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: config.authGPT,
        apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
    });
    

    let count = 0;
    const res = await api.sendMessage(prompt, {
        onProgress: (partialResponse) => {
            count++;
            if (count % 10 === 0) {
              i.editReply(partialResponse.text);
        }
    }});
    console.log(res);
    return res.text;
}


// export async function execute(interaction: CommandInteraction) {
//     console.log(interaction.channelId); 
//     if (interaction.channelId !== "1130252359927349280" && interaction.channelId !== "1129414570348384256") {
//         return interaction.reply("Cette commande est disponible que dans le channel Chat-GPT");
//     }

//     console.log("gpt2");
//     const modal = new ModalBuilder()
// 			.setCustomId("myModal")
// 			.setTitle("My Modal");

// 		// Add components to modal

// 		// Create the text input components
// 		const favoriteColorInput = new TextInputBuilder()
// 			.setCustomId("favoriteColorInput")
// 		    // The label is the prompt the user sees for this input
// 			.setLabel("What's your favorite color?")
// 		    // Short means only a single line of text
// 			.setStyle(TextInputStyle.Short);

// 		const hobbiesInput = new TextInputBuilder()
// 			.setCustomId("hobbiesInput")
// 			.setLabel("What's some of your favorite hobbies?")
// 		    // Paragraph means multiple lines of text.
// 			.setStyle(TextInputStyle.Paragraph);

// 		// An action row only holds one text input,
// 		// so you need one action row per text input.
// 		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
// 		const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput);

// 		// Add inputs to the modal
// 		modal.addComponents(firstActionRow, secondActionRow);

// 		// Show the modal to the user
// 		await interaction.showModal(modal);
// }