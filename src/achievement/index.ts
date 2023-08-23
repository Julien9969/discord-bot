import { Client, Events, GuildMember, Message, PartialMessage } from "discord.js"; 
import { VoiceChannelUser, GuildRanking } from "../interface/voice-channel-ranking";
import * as fs from "fs";

const voiceChannelUsers: Map<string, VoiceChannelUser> = new Map();

export async function achievement(client: Client<true>) {
    console.log("Achievment started");

    client.on(Events.MessageCreate, (message: Message<boolean>) => {
        console.log("Message created");
    });

    client.on(Events.MessageDelete, (member: Message<boolean> | PartialMessage) => {
        console.log("Message deleted");
    });

    client.on(Events.MessageUpdate, (oldMessage: Message<boolean> | PartialMessage, newMessage: Message<boolean> | PartialMessage) => {
        console.log("Message updated");
    });
    
    client.on(Events.MessageReactionAdd , (message) => {
        console.log("Reaction added");
    });

    client.on(Events.MessageReactionRemove, (message) => {
        console.log("Reaction removed");
    });

    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        const member: GuildMember | null = newState.member;
        if (!member) return;

        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        if (!oldChannel && newChannel) {
            voiceChannelUsers.set(member.id, {
                guildId: member.guild.id,
                userId: member.id,
                userName: member.displayName,
                joinTime: Date.now()
            });
        }

        if (oldChannel && !newChannel) {
            const userRecord = voiceChannelUsers.get(member.id);
            if (userRecord) {
                const durationInS = (Date.now() - userRecord.joinTime) / 1000;
                console.log(`${member.displayName} left ${oldChannel.name} after ${durationInS}s.`);

                await updateRankingOnLeave(member);
                voiceChannelUsers.delete(member.id);
            }
        }
    });

    await registerMembersInVoiceChannel(client);

    setInterval(async () => {
        await updateRanking(client);
    }, 1000 * 60 * 3);
}


async function registerMembersInVoiceChannel(client: Client<true>) {
    client.guilds.cache.forEach(async (guild) => {
        if (!guild) return;
        guild.members.cache.forEach((member) => {
            if (member.voice.channel) {
                console.log(`register ${member.displayName} that was in ${member.voice.channel.name}.`);
                voiceChannelUsers.set(member.id, {
                    guildId: guild.id,
                    userId: member.id,
                    userName: member.displayName,
                    joinTime: Date.now()
                });
            }
        });
    });
}

async function updateRankingOnLeave(member: GuildMember) {
    let guildVoiceChannelData: GuildRanking = await readRanking();

    guildVoiceChannelData = await updateMemberTiming(member, guildVoiceChannelData);
    voiceChannelUsers.delete(member.id);

    fs.writeFileSync("src/achievement/time-ranking-db.json", JSON.stringify(guildVoiceChannelData, null, 4));
}

async function updateRanking(client: Client<true>) {
    let guildVoiceChannelData = await readRanking();

    const userUpdatePromises = Array.from(voiceChannelUsers.values()).map(async (user) => {
        const member = await client.guilds.cache.get(user.guildId)?.members.fetch(user.userId);
        
        if (member?.voice.channel) {
            guildVoiceChannelData = await updateMemberTiming(member, guildVoiceChannelData);

            voiceChannelUsers.set(member.id, {
                guildId: member.guild.id,
                userId: member.id,
                userName: member.displayName,
                joinTime: Date.now()
            });
        }
    });
    await Promise.all(userUpdatePromises);
    
    fs.writeFileSync("src/achievement/time-ranking-db.json", JSON.stringify(guildVoiceChannelData, null, 4));
}

async function updateMemberTiming(member: GuildMember, guildVoiceChannelData: GuildRanking): Promise<GuildRanking> {
    const guildId = member.guild.id;
    const memberFind = voiceChannelUsers.get(member.id);

    if (!memberFind) return {...guildVoiceChannelData};

    const durationInS = (Date.now() - memberFind.joinTime) / 1000;

    if (!guildVoiceChannelData[guildId]) {
        guildVoiceChannelData[guildId] =
        [{
            ...memberFind,
            joinTime: durationInS
        }];

    } else {
        const memberIndex = guildVoiceChannelData[guildId].findIndex((m) => m.userId === member.id);
        if (memberIndex !== -1) {
            guildVoiceChannelData[guildId][memberIndex].joinTime += durationInS;
        } else {
            guildVoiceChannelData[guildId].push({
                ...memberFind,
                joinTime: durationInS
            });
        }
    }

    return {...guildVoiceChannelData};
}

async function readRanking(): Promise<GuildRanking> {
    try {
        const data = fs.readFileSync("src/achievement/time-ranking-db.json", "utf-8");
        return JSON.parse(data) as GuildRanking;
    } catch (error) {
        return {};
    }
}


