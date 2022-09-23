const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

exports.execute = (client, message) => {

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setURL(`https://riftyporo.vercel.app`)
        .setEmoji('<:discord_icon:890520198862479360>')
        .setLabel('Take me to your server'),
    )

  const embed = new MessageEmbed()
    .setAuthor("Rifty Poro")
    .setDescription(``)
    .setColor("BLUE")
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL)
    .addField(`<:blurple_link:890563331235147777> **Links**:`, `[Invite](${client.config.invitelink}) | [Upvote](https://top.gg/bot/888249861605048350/vote) | [Website](https://riftyporo.vercel.app) | [Server](https://discord.gg/xGYHcShmCN)`, false)
    .addField(`<:commands:890520399094349834> **Commands**:`, `If you want to master at rifty poro,\ncheck https://riftyporo.vercel.app or \`${client.prefix}commands\`.`, false)
    .addField(`<:Support:890562661501247508> **Bot Support**:`, `You can join [the support server](https://discord.gg/33xftnyECa) if you want to \`contact the developer, submit a bug, or suggest a feature\`. Poro is waiting for you!`, false)
    .addField(`<:Stats:890554112008155157> **Bot Stats**:`, `If you want to check how poro is doing, \`${client.prefix}about!\`\n<:Blurple_Hastag:890564446303440916> ${client.config.latestfeed}`, false)
    //.setImage('https://media.discordapp.net/attachments/889921698286153769/901472512003682364/image0.png');
  return message.reply({ embeds: [embed], components: [row] });
}



exports.help = {
  name: "Help",
  aliases: ["h"],
  usage: `help`,
  info: "Help info."
}

