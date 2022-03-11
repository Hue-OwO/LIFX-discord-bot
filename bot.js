const { Client, Intents, MessageEmbed } = require("discord.js");
const Lifx = require("node-lifx-lan");


const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("lifxbulblist")) {
      Lifx.discover({wait:500}).then((device_list) => {
          device_list.forEach((device) => {
              let dev = device_list[0];
         const lightemb = new MessageEmbed()
            .setColor('DARK_VIVID_PINK')
            .setTitle(String([device['deviceInfo']['label']]))
            .addFields({name: '**Local IP**:', value: String(device['ip']), inline: false})
            .addFields({name: '**Product**:', value: String(device['deviceInfo']['productName'])})
        message.channel.send({embeds: [lightemb]})
      })
}).catch(() => {
  console.error(error);
});
  }

  if (message.content.startsWith("lifxsetcolor")) {
            Lifx.discover({wait:500}).then((device_list) => {
        device_list.forEach((device) => {
         const args = message.content.trim().split(/ +/g)
      let clr = args.slice(1).join(" ");
      Lifx.setColorBroadcast({
        color: {css: clr}
      }).then(() => {
        console.log('Done!');
        message.channel.send(`**${String ([device['deviceInfo']['label']])}** Has been set to **${clr}**`)
      }).catch((error) => {
          console.error(error)
      })
        })
      })
  }

});

const config = require('./token.json');
client.login(config.token);