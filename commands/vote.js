const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
exports.execute = async (client, message, args) => {

   const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setURL(`https://top.gg/bot/888249861605048350/vote`)
        .setEmoji('<:PoroCoin:891675893871816734>')
        .setLabel('Upvote Me'),
    )
  
  const voteEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setTitle("Upvote Me!")
    .setDescription(`Upvote me on [**Top.gg**](https://top.gg/bot/888249861605048350/vote) and get **100** poro coins!`)
    .setFooter("You can vote every 12 hours.");

    message.reply({ embeds: [voteEmbed], components: [row] })
}

exports.help = {
  name: "Vote",
  aliases: ["vote", "upvote"],
  usage: `vote`,
  info: "Vote me and receive 100 poro coins."
}