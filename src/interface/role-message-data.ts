import { RolesButtonData } from "./roles-button-data";

export interface RoleMessageData {
    guildId: string,
    channelId: string,
    messageId: string,
    roles: RolesButtonData[]
}