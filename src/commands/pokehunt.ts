import { CommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder, GuildEmoji, TextBasedChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerState, AudioPlayerStatus, PlayerSubscription, VoiceConnection } from "@discordjs/voice";

let antiAfkInterval: NodeJS.Timeout;
let antiLeaveInterval: NodeJS.Timeout;
let legInterval: NodeJS.Timeout;
let connection: VoiceConnection;

export const data = new SlashCommandBuilder()
  .setName("pokehunt")
  .setDescription("Minuteurs pour la chasse aux pokemons légendaires")
  .addStringOption((option) =>
    option.setName("durée-ou-stop")
        .setDescription("Le temps (mins) avant le prochain légendaire ou 'stop' pour arrêter le minuteur")
        .setRequired(false));

export async function execute(interaction: CommandInteraction) {
    if (!interaction.member) {
      return;
    }
    console.log(interaction.user);

    clearInterval(antiAfkInterval);
    clearInterval(antiLeaveInterval); 
    clearInterval(legInterval); 

    const params = interaction.options.get("durée-ou-stop");
    console.log(params?.value);

    if (params?.value === "stop") {
      console.log("Fin de la chasse aux légendaires");
      
      try { 
        connection.destroy();
      } catch {
        console.log("pas de chasse en cours");
      }
      interaction.reply("On arrête la chasse aux légendaires");
      return;
    }

    const voiceChannel: VoiceBasedChannel | null = (interaction.member as GuildMember).voice.channel;
    if (!voiceChannel) {
      return interaction.reply("Tu dois être dans un channel vocal pour utiliser cette commande!");
    }

    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // Play the song
    const player = createAudioPlayer();

    player.on("error", (error: Error) => {
        console.error(error);
        connection.destroy();
    });

    const subscription = connection.subscribe(player); 
    if (!subscription) {
      console.log("subscription Error");
      return;
    }

    // Remember to move in minecraft
    antiAfkInterval = setInterval(() => {
        player.play(createAudioResources(0.2));
        console.log("anti afk sound played");
    }, 1000 * 60 * 15);

    // make the bot not leave vocal
    antiLeaveInterval = setInterval(() => {
        const player = createAudioPlayer();
        player.play(createAudioResources(0));
        console.log("anti bot leave");
    }, 1000 * 60 * 7);


    if (isNaN(params?.value as number) || params?.value === undefined) {
      interaction.reply("**Timer anti afk lancé**\nTu peux l'arrêter avec la commande `/pokehunt stop`\n*Choisit la durée du timer avant le prochain légendaire avec la commande `/pokehunt <durée en mins>`*");
      return;
    }

    const timeToLeg: number = params.value as number; 

    legInterval = setInterval(() => {
        player.play(createAudioResources(0.3));
        setTimeout(() => { player.play(createAudioResources(0.3)); }, 800);
        const channel = interaction.guild?.channels.cache.get(interaction.channelId) as TextBasedChannel;
        channel.send("C'est l'heure du légendaire !");
        console.log("legendaire time");
        clearInterval(legInterval); 
    }, 1000 * 60 * timeToLeg);

    interaction.reply("Timer pour le prochain legendaire lancé temps : " + timeToLeg + "mins");

    let tempsRestant = timeToLeg * 60 - 5;
    const updateMess = setInterval(() => {
        interaction.editReply("Timer pour le prochain légendaire lancé temps : " + timeToLeg + " mins\nTemps restant : " + Math.floor(tempsRestant / 60) + "mins" + (tempsRestant % 60) + "s");
        if (tempsRestant <= 0) {
            interaction.deleteReply();
            clearInterval(updateMess);
        }
        tempsRestant -= 5;
    }, 5000);
}

function createAudioResources(vol: number) {
    const resource = createAudioResource("./assets/Ram Bell Sound.mp3", {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
    });
    
    resource.volume?.setVolume(vol);
    return resource;
}

