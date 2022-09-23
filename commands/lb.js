const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    const embed = new MessageEmbed()
        .setTitle(`Rifty Poro Profile`)
        .setColor("BLUE")
        .setTimestamp();

    let userBalance = await client.eco.fetchMoney(user.id, false);
    await client.eco.leaderboard(false, 10).then((leaderboard) => {
        userposition = "NOT POSITIONED";
        leaderboard.forEach(async u => {
            await client.users.cache.get(u.user).then((un) =>
            embed.addField(u.position + "." ,"> "+ un.username)
            );
        })
    

    
    return message.reply({embeds: [embed]});
 })
}

exports.help = {
    name: "Balance",
    aliases: ["leaderboard", "board"],
    usage: `bal`,
    info: "See your poro coin balance."
  }