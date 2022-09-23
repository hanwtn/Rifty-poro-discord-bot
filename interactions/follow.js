const { MessageActionRow, MessageButton, MessageEmbed , Permissions } = require("discord.js");

exports.execute = async (client, interaction) => {

  if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && !client.config.admins.includes(interaction.member.id)) {
    return interaction.reply(`You need administrator permission to use this command.`);
  }
  const channel = await client.db.get(`twitter_${interaction.guild.id}`, "profile")
  if (channel) {
    return interaction.reply(`This guild has already followed to twitter in <#${channel}>.`);
  }
  else if (!channel) {
    await client.db.set(`twitter_${interaction.guild.id}`, {guildprefix: `0`, profile: `${interaction.channel.id}`})
    return interaction.reply({ content: "This channel of the guild now followed to LOL:WildRift's official Twitter." });
  }
}


const { SlashCommandBuilder } = require('@discordjs/builders');
exports.data = new SlashCommandBuilder()
  .setName('follow')
  .setDescription("Follow current channel of the guild to LOL:WildRift's official twitter.")

