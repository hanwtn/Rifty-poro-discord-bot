const { Permissions } = require('discord.js');
exports.execute = async (client, message, args) => {
  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && !client.config.admins.includes(message.member.id)) {
    return message.reply(`<:poro:890828127733964820> | My prefix for this server is **${client.prefix}**.`);
  }
  else {
    const prefix = args[0];
    if (!prefix) {
      return message.reply(`<:poro:890828127733964820> | My prefix for this server is **${client.prefix}**.`);
    }
    const exist = await client.db.get(`prefix_${message.guild.id}`)
    if (prefix === 'reset') {
      if(exist){
      await client.db.delete(`prefix_${message.guild.id}`);
      return message.reply(`<a:success:890823780992176148> | Prefix for this server has been reset.`);
      }
      if(!exist){
        return message.reply(`<a:success:890823780992176148> | Prefix for this server has been reset.`);
      }
    } else {
      let setTo = await client.db.set(`prefix_${message.guild.id}`, {guildprefix: `${prefix}`, profile: "0"});
      return message.reply(`<a:success:890823780992176148> | Prefix set to \`${prefix}\`.`);
    }
  }
}

exports.help = {
  name: "Prefix",
  aliases: ["setprefix", "set"],
  usage: `prefix [new]*`,
  info: "See or set prefix."
}

