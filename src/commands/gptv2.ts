import { ActionRowBuilder, CacheType, CommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
// import { oraPromise } from "ora";
import { config } from "../config";


export const data = new SlashCommandBuilder()
  .setName("gptv2")
  .setDescription("Ask GPT-3 to generate a text");

export async function execute(interaction: CommandInteraction) {
    console.log(interaction.channelId); 
    if (interaction.channelId !== "1130252359927349280" && interaction.channelId !== "1129414570348384256") {
        return interaction.reply("Cette commande est disponible que dans le channel Chat-GPT");
    }

    console.log("gpt2");
    const modal = new ModalBuilder()
			.setCustomId("myModal")
			.setTitle("My Modal");

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId("favoriteColorInput")
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId("hobbiesInput")
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

    // try {
    //     // Wait for the user to respond with their name
    //     const nameResponse = await message.channel.awaitMessages(filter, options);
    //     const name = nameResponse.first()?.content || '';

    //     // Update the embed to reflect the user's response
    //     formEmbed.fields[0].value = name;
    //     sentEmbed.edit(formEmbed);

    //     // Repeat the process for age and email
    //     const ageResponse = await message.channel.awaitMessages(filter, options);
    //     const age = parseInt(ageResponse.first()?.content || '0', 10);
    //     formEmbed.fields[1].value = age.toString();
    //     sentEmbed.edit(formEmbed);

    //     const emailResponse = await message.channel.awaitMessages(filter, options);
    //     const email = emailResponse.first()?.content || '';
    //     formEmbed.fields[2].value = email;
    //     sentEmbed.edit(formEmbed);

    //     // You can add more fields as needed

    //     // Process the collected information or store it in a database
    //     // For this example, we'll simply display the information back to the user in a new embed
    //     const responseEmbed = new MessageEmbed()
    //     .setColor('#00ff00')
    //     .setTitle('Form Submitted')
    //     .setDescription('Thank you for submitting the form!')
    //     .addField('Name', name, true)
    //     .addField('Age', age.toString(), true)
    //     .addField('Email', email, true);

    //     await message.channel.send(responseEmbed);
    // } catch (error) {
    //     await message.channel.send('Form submission timed out. Please try again later.');
    // }
    // }

    // await interaction.reply("Je réflechie...");
    
    // const res = await askGPT(prompt?.value as string, interaction);
    
    // return await interaction.editReply(res);
}

async function askGPT(prompt: string, i: CommandInteraction<CacheType>) {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: config.authGPT,
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