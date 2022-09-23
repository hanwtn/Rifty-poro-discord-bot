const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
    if (!client.config.admins.includes(message.author.id)) return; // return if author isn't bot owner
    let user = message.mentions.users.first();
    if (!user) return message.channel.send("Please specify a user!");
    let amount = args[1];
    if (!amount || isNaN(amount)) return message.reply("Please specify a valid amount.");
    let data = await client.eco.addMoney(user.id, false, parseInt(amount));

    const embed = new MessageEmbed()
        .setTitle(`Coins Added!`)
        .addField(`User`, `<@${user.id}>`)
        .addField(`Balance Given`, `${amount.toLocaleString()} <:PoroCoin:891675893871816734>`)
        .addField(`Total Amount`, `${data.toLocaleString()} <:PoroCoin:891675893871816734>`)
        .setColor("BLUE")
        .setThumbnail(user.avatarURL())
        .setTimestamp();
    return message.channel.send({embeds: [embed]});
}

exports.help = {
    name: "addcoins",
    aliases: ["add", "addcoins"],
    usage: `addcoins`,
    info: "Add poro coins."
  }