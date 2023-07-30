/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, ComponentType, Message, SlashCommandBuilder } from "discord.js";
import { ChatGPTUnofficialProxyAPI, ChatMessage } from "chatgpt";
// import { oraPromise } from "ora";
import { config } from "../config";
import { oraPromise } from "ora";

export const data = new SlashCommandBuilder()
  .setName("gpt")
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
    
    const gptRep = await askGPT(prompt?.value as string, interaction);

    const continueButton = new ButtonBuilder()
    .setCustomId("continue")
    .setLabel("Continuer La réponse")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("⏩");

    const uneAutreButton = new ButtonBuilder()
    .setCustomId("uneAutre")
    .setLabel("Autre réponse")
    .setStyle(ButtonStyle.Success)
    .setEmoji("1️⃣");

    const newMessageButton = new ButtonBuilder()
    .setCustomId("newMessage")
    .setLabel("Continuer la conversation")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⚡");


    const row = new ActionRowBuilder();
    row.addComponents(continueButton, uneAutreButton, newMessageButton);
    
    const rep = await interaction.editReply({content: gptRep.text, components: [row] as any});

    createCollector(rep, interaction, gptRep, row);
}

async function askGPT(prompt: string, i: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, prevRep?: ChatMessage): Promise<ChatMessage> {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: config.authGPT,
        apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
    });
    
    let count = 0;

    const res = await oraPromise(
        api.sendMessage(prompt, {
            parentMessageId: prevRep?.id,
            conversationId: prevRep?.conversationId,
            onProgress: (partialResponse) => {
            count++;
                if (count % 10 === 0) {
                    i.editReply(partialResponse.text);
                }
            }
        }
        ),
        {
          text: prompt,
        }
    );

    console.log(res);
    return res;
}

async function createCollector(rep: Message<boolean>, previousInteraction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, gptRep: ChatMessage, row: ActionRowBuilder) {
    const collector = rep?.createMessageComponentCollector({ 
        componentType: ComponentType.Button,
    });

    const time = setTimeout(async () => {
        await previousInteraction.editReply({ components: [] });
    }, 15_000);

    collector.on("collect", async (interaction) => {
    await previousInteraction.editReply({ components: [] });
    
        if (interaction.isButton()) {
            await interaction.deferReply({ ephemeral: false });
            if (interaction.customId === "continue") {

                const res = await askGPT("Continue", interaction, gptRep);
                const rep = await interaction.editReply({content: res.text, components: [row] as any});
                createCollector(rep, interaction, res, row);

            } else if (interaction.customId === "newMessage") {
                // clearTimeout(time);
                // const res = await askGPT("", interaction);
                // await interaction.editReply({content: res.text, components: [row] as any});
                const rep = await interaction.editReply({ content: "TODO" });
                console.log("TODO new message in conversation");

            } else if (interaction.customId === "uneAutre") {

                const res = await askGPT("Une autre", interaction, gptRep);
                const rep = await interaction.editReply({content: res.text, components: [row] as any});
                createCollector(rep, interaction, res, row);
            }
        }
    });
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