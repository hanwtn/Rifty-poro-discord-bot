const Discord = require("discord.js");
module.exports = async (client, guild) => {
    const fetchedChannel = await client.channels.fetch(`904605774041477150`);
    const EmbedLeave = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle(`Left Guild: ${guild.name}.`)
    .setDescription(`Guild owner: <@${guild.ownerId}>\nMembers: ${guild.memberCount}`)
    .setTimestamp()
    fetchedChannel.send({embeds: [EmbedLeave]})
    
}