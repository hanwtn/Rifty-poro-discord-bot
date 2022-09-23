const { MessageEmbed, version } = require("discord.js");
const moment = require("moment");

exports.execute = async (client, message, args) => {

  const trip = Math.floor(
   ( Date.now() - moment(message.createdTimestamp).valueOf() ) / 4
  );
  let clientconnectionEmote = "<:the_connection_is_bad:890517466172751912>";
  let apiconnectionEmote = "<:the_connection_is_bad:890517466172751912>";

  if (Math.round(trip) < 70) {
    clientconnectionEmote = "<:the_connection_is_excellent:890516737781542962>";
  }
  if (Math.round(trip) >= 70 && Math.round(trip) <= 140) {
    clientconnectionEmote = "<:the_connection_is_good:890516915909431316>";
  }
  if (Math.round(trip) > 110) {
    clientconnectionEmote = "<:the_connection_is_bad:890517466172751912>";
  }
  

    const embed = new MessageEmbed();
    embed.setColor("#91BAD6");
    embed.setTitle(`Stats`);
    embed.setTimestamp();
    //embed.setFooter("Rifty Poro isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Wild Rift. Wild Rift and Riot Games are trademarks or registered trademarks of Riot Games, Inc. Wild Rift © Riot Games, Inc.")
    embed.addFields(
      {
        name: "Ping",
        value: `${clientconnectionEmote} ${Math.round(trip)} ms`,
        inline: true,
      }
    );

    embed.addFields(
      {
        name: "Servers",
        value: `<:discord_icon:890520198862479360> \`${client.guilds.cache.size.toLocaleString()}\``,
        inline: true,
      },
      {
        name: "Developer",
        value: `<:blurple_verified_bot_developer:890499346674614282> \`hans_#4863\``,
        inline: true,
      }
    );
    embed.addFields(
      {
        name: "Version",
        value: `<:porobot:1004263838952206386> \`v${
          require("../package.json").version
        }\``,
        inline: true,
      }
    );

    return message.reply({ embeds: [embed] });
  
};

exports.help = {
  name: "Bot Stats",
  aliases: ["ping", "latency", "about", "bot"],
  usage: `about`,
  info: "About Rifty Poro.",
};
