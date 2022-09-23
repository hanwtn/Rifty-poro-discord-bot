const { MessageActionRow, MessageButton, MessageEmbed , Permissions } = require("discord.js");

exports.execute = async (client, message) => {

  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && !client.config.admins.includes(message.member.id)) {
    return message.reply(`You need administrator permission to use this command.`);
  }
  const channel = await client.db.get(`twitter_${message.guild.id}`, "profile")
  if (!channel) {
    return message.reply(`This guild hasn't followed to LOL:WildRift's official Twitter.`);
  }
  else if (channel) {
    await client.db.delete(`twitter_${message.guild.id}`)
    return message.reply({ content: "The guild now unfollowed to LOL:WildRift's official Twitter." });
  }
}



exports.help = {
  name: "Unfollow",
  aliases: ["uf"],
  usage: `unfollow`,
  info: "Unfollow to LOL:WildRift's official twitter."
}