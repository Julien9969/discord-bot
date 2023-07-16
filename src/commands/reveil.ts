import { CommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder, GuildEmoji } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerState, AudioPlayerStatus, PlayerSubscription } from "@discordjs/voice";


export const data = new SlashCommandBuilder()
  .setName("reveil")
  .setDescription("Reveil bilal");

export async function execute(interaction: CommandInteraction) {
    if (!interaction.member) {
      return;
    }
    console.log(interaction.user);
    if (interaction.user.username == "bilaltlili") {
      return interaction.reply("On te réveil pas si tu dors pas !");
    }

    console.log("reveil");
    const voiceChannel: VoiceBasedChannel | null = (interaction.member as GuildMember).voice.channel;
    if (!voiceChannel) {
      return interaction.reply("Tu dois être dans un channel vocal pour utiliser cette commande!");
    }

    // Connect to the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // Play the song
    const player = createAudioPlayer();
    const subscription = connection.subscribe(player); 
    if (!subscription) {
      console.log("subscription Error");
    }

    const resource = createAudioResource("./assets/ring.mp3", {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
    });
    player.play(resource);
    console.log(player.state.status);
    console.log("Current path:", process.cwd());
	  // if (subscription) {
		// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
		setTimeout(() => {
      (subscription as PlayerSubscription).unsubscribe();
      connection.destroy();
    }, 60_000);
	  

    // Handle errors and cleanup after playback ends
    player.on("error", (error: Error) => {
      console.error(error);
      connection.destroy();
    });

    player.on("stateChange", (oldState: AudioPlayerState , newState: AudioPlayerState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
		    console.log("destroy");
		    const resource = createAudioResource("./assets/ring.mp3");
		    player.play(resource);
        // connection.destroy();
      }
    });

    const customEmojiName = "Screenshot_20221014160830103_com";
    let customEmoji = interaction.guild?.emojis.cache.find(
      (emoji) => emoji.name === customEmojiName
    );
    if (!customEmoji) {
      customEmoji = { id: "🫡" } as GuildEmoji;
    }

    const stopButton = new ButtonBuilder()
    .setCustomId("stop-button")
    .setLabel("Stop Réveil")
    .setStyle(ButtonStyle.Danger)
    .setEmoji(customEmoji.id);


    const row = new ActionRowBuilder()
    .addComponents(stopButton);

    // await interaction.channel?.send("Je reveil bilal !");
    
    try {
      const rep = await interaction.reply({
        content: "Je reveil bilal !",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components: [row] as any,
      });
      const confirmation = await rep?.awaitMessageComponent({ time: 61_000 });
      if (confirmation?.customId === "stop-button") {
        connection.destroy();
        interaction.editReply({ content: "Réveil arreté", components: [] });
      }
    } catch (e: unknown) {
      await interaction.editReply({ content: "Arrête automatique", components: [] });
    }
}