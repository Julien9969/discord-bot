import { Guild } from "discord.js";

export interface generateLeaderboardOptions {
    guild: Guild;
    title?: string;
    color?: string;
    top?: number;
    thumbnail?: string;
}