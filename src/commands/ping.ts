import { CommandInteraction, SlashCommandBuilder } from "discord.js";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import mihome from "node-mihome";
 
export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
    console.log(interaction.user.username);
        // Show the modal to the user
    // await interaction.showModal(modal);
    interaction.deferReply();
    
        // local miIO
    // mihome.miioProtocol.init();

    // // local Aqara (ZigBee)
    // mihome.aqaraProtocol.init();

    // // cloud MIoT
    // // const username = "jcroux.roux@gmail.com";
    // // const password = "2710FR69jc3001*";
    // await mihome.miCloudProtocol.login(username, password);

    // const device = await mihome.miCloudProtocol.getDevices(null);
    // // const device = await mihome.miCloudProtocol.getDevices(["99356848"]);
    // console.log(device[0]);
    // // const patrick = mihome.device({
    // //     id: '100000', // required, device id
    // //     model: 'zhimi.aircondition.v1', // required, device model
      
    // //     address: '192.168.31.13', // miio-device option, local ip address
    // //     token: 'abcdefgfabcdefgfabcdefgfabcdefgf', // miio-device option, device token
    // //     refresh: 30000 // miio-device option, device properties refresh interval in ms
        
    // //     parent: '1234abcd', // aqara-device option, gateway SID for aqara-protocol compatible device
    // //});

    // // const patrick = mihome.device({
    // //     did: "99356848", // required, device id
    // //     model: "lumi.light.aqcn02",
      
    // //     localip: "192.168.1.129",
    // //     token: "53421b0fb7c9b0aad2ef8a9ab58957a6",
    // //     refresh: 30000, // miio-device option, device properties refresh interval in ms
        
    // //     parent: "", // aqara-device option, gateway SID for aqara-protocol compatible device
    // // });
    // device[0].model = "lumi.light.aqcn02";
    // device[0].address = "192.168.1.129";
    // const pat = mihome.device(device[0]);

    // await pat.setPower(true); // call the method
    // await pat.init(); // connect to device and poll for properties
    // pat.destroy();
    return interaction.editReply("Pong! 5");
}



// {
//     did: '99356848',
//     token: '53421b0fb7c9b0aad2ef8a9ab58957a6',
//     longitude: '0.0',
//     latitude: '0.0',
//     name: 'Patrick',
//     pid: '0',
//     localip: '192.168.1.129',
//     mac: '7C:49:EB:B7:FE:92',
//     ssid: 'WRT160N',
//     bssid: '1C:B7:2C:DA:FF:D0',
//     parent_id: '',
//     parent_model: '',
//     show_mode: 1,
//     model: 'yeelink.light.color2',
//     adminFlag: 1,
//     shareFlag: 0,
//     permitLevel: 16,
//     isOnline: true,
//     desc: 'Device online ',
//     extra: {
//       isSetPincode: 0,
//       pincodeType: 0,
//       fw_version: '2.0.6_0065',
//       needVerifyCode: 0,
//       isPasswordEncrypt: 0
//     },
//     uid: 1705611169,
//     pd_id: 436,
//     password: '',
//     p2p_id: '',
//     rssi: -56,
//     family_id: 0,
//     reset_flag: 0
//   },
