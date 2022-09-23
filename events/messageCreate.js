const {
  Collection,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const Timeout = new Collection();
const ms = require("ms");
module.exports = async (client, message) => {
  if (
    message.author.id === "901653344932732988" &&
    message.channel.id === "901658389040492554"
  ) {
    let add = await client.eco.addMoney(message.content, false, 1000);

    const receivedEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("100 Poro Coins received.")
      .setDescription(`Thanks for voting me on [Top.gg]( )!`)
      .addField(
        "Current Balance",
        " <:PoroCoin:891675893871816734>" + add.toLocaleString()
      )
      .setFooter("You can vote every 12 hours.");

    client.users.fetch(message.content).then((user) => {
      user
        .send({ embeds: [receivedEmbed] })
        .catch(() => console.log("NEW VOTE! (DM is closed)."));
    });
  }

  if (client.config.admins.includes(message.author.id)) {
    if (message.content === "r!guilds") {
      const backId = "back";
      const forwardId = "forward";
      const backButton = new MessageButton({
        style: "SECONDARY",
        emoji: "<a:Blue_Arrow_Left:902248210687483924>",
        customId: backId,
      });
      const forwardButton = new MessageButton({
        style: "SECONDARY",
        emoji: "<a:Blue_Arrow_Right:902153831511646230>",
        customId: forwardId,
      });

      // Put the following code wherever you want to send the embed pages:

      const { author } = message;
      const guilds = [];
      const elementsOnPage = 25;

      client.guilds.cache.forEach(async (g) => {
        let owner = await g.fetchOwner();
        guilds.push({
          name: g.name,
          info: g.memberCount,
          owner: owner.user.username + "#" + owner.user.discriminator,
        });
      });

      const generateEmbed = async (start) => {
        const current = guilds.slice(start, start + elementsOnPage);

        return new MessageEmbed({
          title: `Showing guilds ${start + 1}-${
            start + current.length
          } out of ${guilds.length}`,
          color: "BLUE",
          fields: await Promise.all(
            current.map(async (c) => ({
              name: `**__${c.name}__**`,
              value: `Members: **${c.info.toLocaleString()}**\nOwner: **${
                c.owner
              }**`,
            }))
          ),
        });
      };

      const canFitOnOnePage = guilds.length <= elementsOnPage;
      const embedMessage = await message.reply({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage
          ? []
          : [new MessageActionRow({ components: [forwardButton] })],
      });

      if (canFitOnOnePage) return;

      // Collect button interactions (when a user clicks a button),
      // but only when the button as clicked by the original message author
      const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user }) => user.id === author.id,
      });

      let currentIndex = 0;
      collector.on("collect", async (interaction) => {
        // Increase/decrease index
        interaction.customId === backId
          ? (currentIndex -= elementsOnPage)
          : (currentIndex += elementsOnPage);
        // Respond to interaction by updating message with new embed
        await interaction.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new MessageActionRow({
              components: [
                // back button if it isn't the start
                ...(currentIndex ? [backButton] : []),
                // forward button if it isn't the end
                ...(currentIndex + elementsOnPage < guilds.length
                  ? [forwardButton]
                  : []),
              ],
            }),
          ],
        });
      });
    }
    if (message.content.toLowerCase().startsWith("r!hardlink")) {
      let args = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");

      await client.db.set(args[1], {
        guildprefix: `0`,
        profile: `${args[2]}`,
      });
      return message.reply("Linked.");
    }
  }

  if (message.author.bot) {
    return;
  }

  if (
    message.content.toLowerCase().startsWith("r!save") ||
    message.content.toLowerCase().startsWith("r!login")
  ) {
    let args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(" ");
    let commandName = args.shift().toLowerCase();
    let command =
      client.commands.get(commandName) ||
      client.commands.get(client.aliases.get(commandName));
    if (!command) return;
    return command.execute(client, message, args);
  }

  if (!message.guild) {
    return message.reply("You can't use this command in DM.");
  }
  if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES"))
    return;

  client.prefix = (await client.db.get(
    `prefix_${message.guild.id}`,
    "guildprefix"
  ))
    ? await client.db.get(`prefix_${message.guild.id}`, "guildprefix")
    : client.config.prefix;
  if (!message.content.toLowerCase().startsWith(client.prefix)) return;
  let args = message.content.slice(client.prefix.length).trim().split(" ");
  let commandName = args.shift().toLowerCase();
  let command =
    client.commands.get(commandName) ||
    client.commands.get(client.aliases.get(commandName));

  const embed = new MessageEmbed()
    .setTitle("Hmmm")
    .setDescription(
      `Poro can't understand this command.\nType **${client.prefix}cmd** to see all available commands.`
    )
    .setFooter("or visit https://riftyporo.vercel.app")
    .setColor("WHITE");

  const tooLongembed = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(`Your message contains invalid inputs.`)
    .setFooter("If nothing is wrong, geth help by joining the support server.")
    .setColor("RED");

  if (!command) return message.reply({ embeds: [embed] });
  if (args.length > 7) return message.reply({ embeds: [tooLongembed] });
  const key = message.author.id;
  const found = Timeout.get(key);
  const cooldownTime = 5000;

  if (found) {
    const timeLeft = found - Date.now();
    if (timeLeft < 1000) {
      return message.reply({
        content: `Slow down, you can use the commands again in **1s**!`,
        ephemeral: true,
      });
    }
    //the part at this command has a default cooldown of, did you want to hard code 15s? or have it be the commands.config.timeout?
    return message.reply({
      content: `Slow down, you can use the commands again in **${ms(
        timeLeft
      )}**!`,
      ephemeral: true,
    });
  } else {
    try {
      command.execute(client, message, args);
    } catch (e) {
      return console.log("Missing Permission.");
    }
    Timeout.set(key, Date.now() + cooldownTime);

    setTimeout(() => {
      Timeout.delete(key);
    }, cooldownTime);
  }
};
