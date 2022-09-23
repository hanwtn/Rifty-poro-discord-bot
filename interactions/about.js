const { MessageEmbed, version } = require("discord.js");
require("moment-duration-format");
const cpuStat = require("cpu-stat");
const moment = require("moment");

exports.execute = (client, interaction) => {
  const guilds = client.guilds.cache;
  users = 0;
  guilds.forEach((g) => {
    users += g.memberCount;
  });

  const trip = Math.floor(
    Date.now() - moment(interaction.createdTimestamp).valueOf()
  );
  let clientconnectionEmote = "<:the_connection_is_bad:890517466172751912>";
  let apiconnectionEmote = "<:the_connection_is_bad:890517466172751912>";

  if (Math.round(trip) < 70) {
    clientconnectionEmote = "<:the_connection_is_excellent:890516737781542962>";
  }
  if (Math.round(trip) >= 70 && Math.round(trip) <= 110) {
    clientconnectionEmote = "<:the_connection_is_good:890516915909431316>";
  }
  if (Math.round(trip) > 110) {
    clientconnectionEmote = "<:the_connection_is_bad:890517466172751912>";
  }
  if (Math.round(client.ws.ping) < 70) {
    apiconnectionEmote = "<:the_connection_is_excellent:890516737781542962>";
  }
  if (Math.round(client.ws.ping) >= 70 && Math.round(client.ws.ping) <= 110) {
    apiconnectionEmote = "<:the_connection_is_good:890516915909431316>";
  }
  if (Math.round(client.ws.ping) > 110) {
    apiconnectionEmote = "<:the_connection_is_bad:890517466172751912>";
  }
  cpuStat.usagePercent(async function (err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
    const duration = moment.duration(client.uptime).format(" D[d], H[h], m[m]");

    const embed = new MessageEmbed();
    embed.setColor("BLUE");
    embed.setTitle(`Stats from \`${client.user.username}\``);
    embed.setTimestamp();
    //embed.setFooter("Rifty Poro isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Wild Rift. Wild Rift and Riot Games are trademarks or registered trademarks of Riot Games, Inc. Wild Rift © Riot Games, Inc.")
    embed.addFields(
      {
        name: `${clientconnectionEmote} Client Latency`,
        value: `<:list_bottom:890492396423479306>\`${Math.round(trip)}ms\``,
        inline: true,
      },
      {
        name: `${apiconnectionEmote} API Latency`,
        value: `<:list_bottom:890492396423479306>\`${Math.round(
          client.ws.ping
        )}ms\``,
        inline: true,
      },
      {
        name: "<:memory:890548510884241419> Memory",
        value: `<:list_bottom:890492396423479306>\`${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)}mb\``,
        inline: true,
      }
    );

    embed.addFields(
      {
        name: "<:discord_icon:890520198862479360> Servers",
        value: `<:list_bottom:890492396423479306>\`${client.guilds.cache.size.toLocaleString()}\``,
        inline: true,
      },
      {
        name: "<:blurple_members:890520678783139871> Users",
        value: `<:list_bottom:890492396423479306>\`${users.toLocaleString()}\``,
        inline: true,
      },
      {
        name: "<:blurple_verified_bot_developer:890499346674614282> Developer",
        value: `<:list_bottom:890492396423479306>\`hans_#4863\``,
        inline: true,
      }
    );
    embed.addFields(
      {
        name: "<:blitzcrank:890545621432422430> Version",
        value: `<:list_bottom:890492396423479306>\`v${
          require("../package.json").version
        }\``,
        inline: true,
      },
      {
        name: "<:djs:890545601891168276> Discord.js",
        value: `<:list_bottom:890492396423479306>\`v${version}\``,
        inline: true,
      },
      {
        name: "<:nodejs:890547369916104704> Node.js",
        value: `<:list_bottom:890492396423479306>\`${process.version}\``,
        inline: true,
      }
    );

    return interaction.reply({ embeds: [embed] });
  });
};

const { SlashCommandBuilder } = require("@discordjs/builders");
exports.data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("About Rifty Poro.");
