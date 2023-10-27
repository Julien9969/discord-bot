import { ColorResolvable, CommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder } from "discord.js";
import { generateLeaderboardOptions } from "../interface/leader-board-options";
import { GuildRanking, VoiceChannelUser } from "../interface/voice-channel-ranking";
import * as fs from "fs";

export const data = new SlashCommandBuilder()
  .setName("ranking")
  .setDescription("Classement par temps dans le vocal");

export async function execute(interaction: CommandInteraction) {
    console.log(interaction.user.username);
    const option: generateLeaderboardOptions = {
        guild: interaction?.guild as Guild,
        title: "Classement temps dans le vocal",
        color: "Random",
        top: 10,
        thumbnail: "https://cdn.discordapp.com/attachments/1129414570348384256/1143656936773009579/ranking-thumbnail.png"
    };
    const embed = await generateLeaderboard(option);

    
    setTimeout(() => {
        interaction.deleteReply();
        console.log("delete ranking");
    }, 2 * 60000);

    try {
    interaction.reply({ embeds: [embed] });
    } catch (e) {
        console.log(e);
    }
}


async function generateLeaderboard(
    options: generateLeaderboardOptions
): Promise<EmbedBuilder> {
    const { guild, title, color, top, thumbnail } = options;

    const data = JSON.parse(fs.readFileSync("src/achievement/time-ranking-db.json", "utf-8")) as GuildRanking;
    const sortedGuildData = data[guild.id].sort((a, b) => b.joinTime - a.joinTime);

    let i = 1;

    const topTen = sortedGuildData.slice(0, top || 10);

    return new EmbedBuilder()
        .setTitle(title || `Leaderboard in **${guild.name}**`)
        .setColor(color as ColorResolvable)
        .setThumbnail(thumbnail || null)
        .setDescription(
            topTen
                .map((user: VoiceChannelUser) => {
                    return `\`${i++}\` <@${user.userId}> (${formatTime(user.joinTime)})`;
                })
                .join("\n\n")
        );
}

function formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor((time % 3600) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
}