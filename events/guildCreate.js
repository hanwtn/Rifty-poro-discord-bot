const Discord = require("discord.js");
module.exports = async (client, guild) => {
    let owner = await guild.fetchOwner();
    const fetchedChannel = await client.channels.fetch(`904605774041477150`);
    const EmbedJoin = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle(`Joined Guild: ${guild.name}!`)
    .setDescription(`Guild owner: ${owner.user.username}#${owner.user.discriminator}\nMembers: ${guild.memberCount}`)
    .setTimestamp()
    fetchedChannel.send({ embeds: [EmbedJoin]})
    
}