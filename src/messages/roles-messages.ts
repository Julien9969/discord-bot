import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, Channel, Client, Collection, Events, GuildChannel, Message, TextBasedChannel } from "discord.js";

const roles = [
    {
        id: "1001853352700805182",
        name: "Rat",
        emoji: "🐀"
    },
    {
        id: "852635795906625597",
        name: "Peuple",
        emoji: "👨‍🌾"
    },
];

export async function createRoleButtons(c: Client<true>) {
    console.log("message roles");
    try {
        const channel = c.channels.cache.get("852644778688380988") as TextBasedChannel;
        if (!channel) {
            console.log("channel not found");
            return;
        }

        const messages = await channel.messages.fetch({ limit: 2}) as Collection<string, Message<true>>;
        const firstMessage = messages.find((message: Message) => message.author.id === c.user?.id);
        console.log("firstMessage : \n", firstMessage);
        console.log("messages : \n", messages);

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(new ButtonBuilder().setCustomId(role.id).setLabel(role.name).setStyle(ButtonStyle.Primary).setEmoji(role.emoji));
        });

        // await channel.send({ content: "Choisis ton rôle", components: [row as any] });
        await firstMessage?.edit({ content: "Choisis ton rôle", components: [row as any] });

        // await channel.send({ content: "Choisis ton rôle"});


    } catch (error) {
        console.log("error : ", error);
    }

};