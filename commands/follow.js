const { MessageActionRow, MessageButton, MessageEmbed , Permissions } = require("discord.js");

exports.execute = async (client, message) => {

  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && !client.config.admins.includes(message.member.id)) {
    return message.reply(`You need administrator permission to use this command.`);
  }
  const channel = await client.db.get(`twitter_${message.guild.id}`, "profile")
  if (channel) {
    return message.reply(`This guild has already followed to twitter in <#${channel}>.`);
  }
  else if (!channel) {
    await client.db.set(`twitter_${message.guild.id}`, {guildprefix: `0`, profile: `${message.channel.id}`})
    return message.reply({ content: "This channel of the guild now followed to LOL:WildRift's official Twitter." });
  }
}



exports.help = {
  name: "Follow",
  aliases: ["f"],
  usage: `follow`,
  info: "Follow current channel of the guild to LOL:WildRift's official twitter."
}
