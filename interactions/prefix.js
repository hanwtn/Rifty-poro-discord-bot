const { Permissions } = require("discord.js");
exports.execute = async (client, interaction) => {
  if (
    !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) &&
    !client.config.admins.includes(interaction.member.id)
  ) {
    return interaction.reply(
      `<:poro:890828127733964820> | My prefix for this server is **${client.prefix}**.`
    );
  } else {
    const prefix = interaction.options.getString("new");
    if (!prefix) {
      return interaction.reply(
        `<:poro:890828127733964820> | My prefix for this server is **${client.prefix}**.`
      );
    }
    const exist = await client.db.get(`prefix_${interaction.guild.id}`);
    if (prefix === "reset") {
      if (exist) {
        await client.db.delete(`prefix_${interaction.guild.id}`);
        return interaction.reply(
          `<a:success:890823780992176148> | Prefix for this server has been reset.`
        );
      }
      if (!exist) {
        return interaction.reply(
          `<a:success:890823780992176148> | Prefix for this server has been reset.`
        );
      }
    } else {
      let setTo = await client.db.set(`prefix_${interaction.guild.id}`, {
        guildprefix: `${prefix}`,
        profile: "0",
      });
      return interaction.reply(
        `<a:success:890823780992176148> | Prefix set to \`${prefix}\`.`
      );
    }
  }
};

const { SlashCommandBuilder } = require("@discordjs/builders");
exports.data = new SlashCommandBuilder()
  .setName("prefix")
  .setDescription("See my prefix if you hate slash commands.")
  .addStringOption((option) =>
    option
      .setName("new")
      .setDescription("New prefix. Type reset to reset to default.")
      .setRequired(false)
  );
