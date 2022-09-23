const { MessageActionRow, MessageButton, MessageEmbed , Permissions } = require("discord.js");

exports.execute = async (client, interaction) => {

  if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && !client.config.admins.includes(interaction.member.id)) {
    return interaction.reply(`You need administrator permission to use this command.`);
  }
  const channel = await client.db.get(`twitter_${interaction.guild.id}`, "profile")
  if (!channel) {
    return interaction.reply(`This guild hasn't followed to LOL:WildRift's official Twitter.`);
  }
  else if (channel) {
    await client.db.delete(`twitter_${interaction.guild.id}`)
    return interaction.reply({ content: "The guild now unfollowed to LOL:WildRift's official Twitter." });
  }
}

const { SlashCommandBuilder } = require('@discordjs/builders');
exports.data = new SlashCommandBuilder()
  .setName('unfollow')
  .setDescription("Unfollow to LOL:WildRift's official twitter.")

