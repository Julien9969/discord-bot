import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, ComponentType, GuildMemberRoleManager, Message, TextBasedChannel } from "discord.js";

const roles = [
    {
        id: "1001853352700805182",
        name: "Rat",
        emoji: "🐀" as string
    },
    {
        id: "852635795906625597",
        name: "Peuple",
        emoji: "👨‍🌾" as string
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
        // console.log("firstMessage : \n", firstMessage);
        // console.log("messages : \n", messages);

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(new ButtonBuilder().setCustomId(role.id).setLabel(role.name).setStyle(ButtonStyle.Primary).setEmoji(role.emoji));
        });

        let rep: Message<any>;
        if (firstMessage) {
            rep = await firstMessage?.edit({ content: "Choisis ton rôle", components: [row as never] });
        } else {
            rep =  await channel.send({ content: "Choisis ton rôle", components: [row as never] });
        }

        const collector = rep?.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
        });

        collector.on("collect", async (interaction) => {
        
            if (interaction.isButton()) {
      
                await interaction.deferReply({ ephemeral: true });
                const role = interaction.guild?.roles.cache.get(interaction.customId);
                console.log("role : ", role);
                if (!role) {
                  interaction.editReply({content: "Role not found"});
                  return;
                }
          
                const hasRole = (interaction.member?.roles as GuildMemberRoleManager).cache.has(role.id);
                console.log("hasRole : ", hasRole);
                if (hasRole) {
                  await (interaction.member?.roles as GuildMemberRoleManager).remove(role);
                  interaction.editReply({content: `Tu n'as plus le rôle ${role.name}`});
                  return;
                }
          
                await (interaction.member?.roles as GuildMemberRoleManager).add(role);
                interaction.editReply({content: `Tu as maintenant le rôle ${role.name}`});
                if ((interaction.member?.roles as GuildMemberRoleManager).cache.has("1033459304071712819")) {
                  await (interaction.member?.roles as GuildMemberRoleManager).remove("1033459304071712819");
                }
                return;
            }   
        });

    } catch (error) {
        console.log("error : ", error);
    }
};

