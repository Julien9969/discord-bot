import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, ComponentType, GuildMemberRoleManager, Message, TextBasedChannel } from "discord.js";
import * as fs from "fs";
import { RoleMessageData } from "../interface/role-message-data";
// const roles = [
//     {
//         id: "1001853352700805182",
//         name: "Rat",
//         emoji: "🐀" as string
//     },
//     {
//         id: "852635795906625597",
//         name: "Peuple",
//         emoji: "👨‍🌾" as string
//     },
// ];

function readRolesMessages() {
    const rolesMessages = JSON.parse(fs.readFileSync("./src/messages/roles-messages.json").toString()) as RoleMessageData[];
    return rolesMessages;
}

export async function createRoleButtons(c: Client<true>) {
    const rolesMessages = readRolesMessages();
    // if (rolesMessages.length === 0) return;	

    rolesMessages.forEach(async (roleMessage) => {
        buildButtons(c, roleMessage);
    });
}

async function buildButtons(c: Client<true>, rolesMessage: RoleMessageData) {
    console.log("Roles buttons created");
    try {
        const channel = c.channels.cache.get(rolesMessage.channelId) as TextBasedChannel;
        if (!channel) {
            console.log("channel not found");
            removeRoleMessage(rolesMessage.messageId);
            return;
        }

        let message: Message<true> | Message<false>;
        try {
            message = await channel.messages.fetch(rolesMessage.messageId);
        } catch (e) {    
            console.log("Le message a été supprimé");
            removeRoleMessage(rolesMessage.messageId);
            return;
        }

        const row = new ActionRowBuilder<ButtonBuilder>();

        rolesMessage.roles.forEach((role) => {
            const buttonBuilder = new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.name)
            .setStyle(ButtonStyle.Primary);

            if (role.emoji) {
                buttonBuilder.setEmoji(role.emoji);
            }
            row.components.push(buttonBuilder);
        });

        const rep = await message?.edit({ content: "Choisis ton rôle", components: [row] });

        const collector = rep?.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.isButton()) {
      
                await interaction.deferReply({ ephemeral: true });
                const role = interaction.guild?.roles.cache.get(interaction.customId);
                if (!role) {
                  interaction.editReply({content: "Le role n'existe plus"});
                  return;
                }
          
                const hasRole = (interaction.member?.roles as GuildMemberRoleManager).cache.has(role.id);
                if (hasRole) {
                  await (interaction.member?.roles as GuildMemberRoleManager).remove(role);
                  interaction.editReply({content: `Tu n'as plus le rôle ${role.name}`});
                  return;
                }
          
                await (interaction.member?.roles as GuildMemberRoleManager).add(role);
                interaction.editReply({content: `Tu as maintenant le rôle ${role.name}`});
            }   
        });

    } catch (error) {
        console.log("error : ", error);
    }
};

function removeRoleMessage(messageId: string) {
    const rolesMessages = readRolesMessages();
    const index = rolesMessages.findIndex((roleMessage) => roleMessage.messageId === messageId);
    rolesMessages.splice(index, 1);
    fs.writeFileSync("./src/messages/roles-messages.json", JSON.stringify(rolesMessages, null, 4));
}

