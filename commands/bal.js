const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let userBalance = await client.eco.fetchMoney(user.id, false);
    await client.eco.leaderboard().then((leaderboard) => {
        userposition = "NOT POSITIONED"
        leaderboard.forEach(u => {
          if (u.user == user.id) {
            userposition = u.position
          }
        })
    

    const embed = new MessageEmbed()
        .setTitle(`Rifty Poro Profile`)
        .addField(`Rifter`, `${user}`)
        .addField(`Balance`, `**${userBalance.toLocaleString()} <:PoroCoin:891675893871816734>**`)
        .addField(`Position`, `**#${userposition}**`)
        .setColor("BLUE")
        .setThumbnail(user.avatarURL())
        .setTimestamp();
    return message.reply({embeds: [embed]});
 })
}

exports.help = {
    name: "Balance",
    aliases: ["bal", "balance"],
    usage: `bal`,
    info: "See your poro coin balance."
  }