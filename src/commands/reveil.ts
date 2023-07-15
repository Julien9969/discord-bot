import { CommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, StreamType } from '@discordjs/voice'


export const data = new SlashCommandBuilder()
  .setName("reveil")
  .setDescription("Reveil bilal");

export async function execute(interaction: CommandInteraction) {
    
    if (!interaction.member) {
      return;
    }
    console.log("reveil");
    const voiceChannel: VoiceBasedChannel | null = (interaction.member as GuildMember).voice.channel;
    if (!voiceChannel) {
      return interaction.reply('Tu dois être dans un channel vocal pour utiliser cette commande!');
    }

    // Connect to the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // Play the song
    const player = createAudioPlayer();
    connection.subscribe(player); 
    const resource = createAudioResource('./assets/ring.mp3', {
        inputType: StreamType.Arbitrary,
        silencePaddingFrames: 1000,
        inlineVolume: true,
    });
    player.play(resource);
    console.log(player.state.status);
    console.log("Current path:", process.cwd());
	// // if (subscription) {
	// 	// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
	// 	// setTimeout(() => subscription.unsubscribe(), 50_000);
	// // }

    // // Handle errors and cleanup after playback ends
    // player.on('error', (error: any) => {
    //   console.error(error);
    //   connection.destroy();
    // });

    // player.on('stateChange', (oldState: any, newState: any) => {
    //   if (newState.status === 'idle') {
	// 	    console.log('destroy')
	// 	    const resource = createAudioResource('\\assets\\ring.mp3');
	// 	    player.play(resource);
    //     // connection.destroy();
    //   }
    // });
    await interaction.channel?.send('Je reveil bilal !');
}