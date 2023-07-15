import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } from '@discordjs/voice'
import { createReadStream } from 'fs'

export async function addSmiley(message) {
	const channel = message.channel;

	// Fetch the latest message in the channel
	const messages = await channel.messages.fetch({ limit: 2 });
	const latestMessage = messages.first();
  const secondsMessages = messages[1];

	// Add a reaction to the latest message
	latestMessage.react('👍');
  secondsMessages.react('🫡');
}

export async function reveil(message, command) {
	const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to be in a voice channel to use this command!');
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
    const resource = createAudioResource('C:\\Users\\69juj\\Desktop\\random\\discord bot\\assets\\ring.mp3');
    player.play(resource);

	// if (subscription) {
		// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
		// setTimeout(() => subscription.unsubscribe(), 50_000);
	// }

    // Handle errors and cleanup after playback ends
    player.on('error', (error) => {
      console.error(error);
      connection.destroy();
    });

    player.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
		console.log('destroy')
		const resource = createAudioResource('C:\\Users\\69juj\\Desktop\\random\\discord bot\\assets\\ring.mp3');
		player.play(resource);
        // connection.destroy();
      }
    });
	await  message.reply('Hello!');
}
