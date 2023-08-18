/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, ComponentType, Message, ModalActionRowComponentBuilder, ModalBuilder, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ChatGPTUnofficialProxyAPI, ChatMessage } from "chatgpt";
// import { oraPromise } from "ora";
import { config } from "../config";
import { oraPromise } from "ora";

let gptRep: ChatMessage;

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
    
    gptRep = await askGPT(prompt?.value as string, interaction);

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

async function askGPT(prompt: string, i: CommandInteraction<CacheType> | ButtonInteraction<CacheType> | ModalSubmitInteraction<CacheType>, prevRep?: ChatMessage): Promise<ChatMessage> {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: config.authGPT,
        apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
        // apiReverseProxyUrl: "https://xrkaxfx-juju.eu1.pitunnel.com/api/conversation"
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
    gptRep = res;
    return res;
}

async function createCollector(rep: Message<boolean>, previousInteraction: CommandInteraction<CacheType> | ButtonInteraction<CacheType> | ModalSubmitInteraction<CacheType>, gptRep: ChatMessage, row: ActionRowBuilder) {
    const collector = rep?.createMessageComponentCollector({ 
        componentType: ComponentType.Button,
    });

    const time = setTimeout(async () => {
        await previousInteraction.editReply({ components: [] });
    }, 15_000);

    collector.on("collect", async (interaction) => {
        await previousInteraction.editReply({ components: [] });
        
        if (interaction.isButton()) {
            if (interaction.customId === "continue") {
                await interaction.deferReply({ ephemeral: false });

                const res = await askGPT("Continue", interaction, gptRep);
                const rep = await interaction.editReply({content: res.text, components: [row] as any});
                createCollector(rep, interaction, res, row);

            } else if (interaction.customId === "newMessage") {
                await textPromptModal(interaction);
            } else if (interaction.customId === "uneAutre") {
                await interaction.deferReply({ ephemeral: false });

                const res = await askGPT("Une autre", interaction, gptRep);
                const rep = await interaction.editReply({content: res.text, components: [row] as any});
                createCollector(rep, interaction, res, row);
            }
        }
    });
}

async function textPromptModal(interaction: ButtonInteraction<CacheType>) {

    const modal = new ModalBuilder()
        .setCustomId("promptGPTmodal")
        .setTitle("GPT Prompt");


    const favoriteColorInput = new TextInputBuilder()
        .setCustomId("PromptGPT")
        .setLabel("Prompt a envoyer dans la même conversation")
        .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
    modal.addComponents(firstActionRow);

  await interaction.showModal(modal);
}

export async function modalProcess(interaction: ModalSubmitInteraction<CacheType>) {
    const gptPrompt = interaction.fields.getTextInputValue("PromptGPT");
    console.log(gptPrompt);
    
    const res = await askGPT(gptPrompt, interaction, gptRep);

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

    createCollector(rep, interaction, res, row);
}
