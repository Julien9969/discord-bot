import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import { oraPromise } from "ora";
import { config } from "../config";


export const data = new SlashCommandBuilder()
  .setName("gpt")
  .setDescription("Ask GPT-3 to generate a text")
  .addStringOption((option) =>
    option.setName("prompt")
        .setDescription("GPT prompt")
        .setRequired(true));

export async function execute(interaction: CommandInteraction) {
    console.log(interaction.channelId); 
    if (interaction.channelId !== "1130252359927349280" && interaction.channelId !== "1129414570348384256") {
        return interaction.reply("Cette commande est disponible que dans le channel Chat-GPT");
    }

    if (config.GPT_API === "") {
        return interaction.reply("Impossible de se connecter à l'API GPT-3");
    }
    const prompt = interaction.options.get("prompt");
    console.log("prompt : ", prompt?.value);
    
    await interaction.reply("Je réflechie...");
    
    const res = await askGPT(prompt?.value as string, interaction);
    
    return await interaction.editReply(res);
}

async function askGPT(prompt: string, i: CommandInteraction<CacheType>) {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: config.GPT_API,
        apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
    });
    
    // const res = await oraPromise(api.sendMessage(prompt), {
    //     text: prompt
    // });
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