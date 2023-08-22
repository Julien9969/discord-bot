export interface VoiceChannelUser {
    guildId: string;
    userId: string;
    userName: string;
    joinTime: number;
}

export interface GuildRanking {
    [guildId: string]: VoiceChannelUser[];
}