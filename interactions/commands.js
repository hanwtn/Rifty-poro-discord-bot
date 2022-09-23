const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
exports.execute = async (client, interaction) => {


  // Constants

  const backId = 'back'
  const forwardId = 'forward'
  const backButton = new MessageButton({
    style: 'SECONDARY',
    emoji: '<a:Blue_Arrow_Left:902248210687483924>',
    customId: backId
  })
  const forwardButton = new MessageButton({
    style: 'SECONDARY',
    emoji: '<a:Blue_Arrow_Right:902153831511646230>',
    customId: forwardId
  })


  // Put the following code wherever you want to send the embed pages:

  const commands = []
  const elementsOnPage = 3


  client.commands.forEach(cmd => {
    commands.push({ name: cmd.help.name, usage: cmd.help.usage, info: cmd.help.info });
  });

  const prefix = await client.prefix;
  const generateEmbed = async start => {
    const current = commands.slice(start, start + elementsOnPage)

    return new MessageEmbed({
      title: `Showing commands ${start + 1}-${start + current.length} out of ${
        commands.length
        }`,
      color: "BLUE",
      fields: await Promise.all(
        current.map(async c => ({
          name: `<:wildriftlogo:890079250395332698> **${prefix}${c.usage}**`,
          value: `*${c.info}*`
        }))
      )
    })
  }

  const canFitOnOnePage = commands.length <= elementsOnPage
  const embedMessage = await interaction.reply({
    embeds: [await generateEmbed(0)],
    components: canFitOnOnePage
      ? []
      : [new MessageActionRow({ components: [forwardButton] })]
  })

  if (canFitOnOnePage) return

  // Collect button interactions (when a user clicks a button),
  // but only when the button as clicked by the original message author
  const collector = interaction.channel.createMessageComponentCollector({
    filter: ({ user }) => user.id === interaction.member.id
  })

  let currentIndex = 0
  collector.on('collect', async interaction => {
    // Increase/decrease index
    interaction.customId === backId ? (currentIndex -= elementsOnPage) : (currentIndex += elementsOnPage)
    // Respond to interaction by updating message with new embed
    await interaction.update({
      embeds: [await generateEmbed(currentIndex)],
      components: [
        new MessageActionRow({
          components: [
            // back button if it isn't the start
            ...(currentIndex ? [backButton] : []),
            // forward button if it isn't the end
            ...(currentIndex + elementsOnPage < commands.length ? [forwardButton] : [])
          ]
        })
      ]
    })
  })


}

const { SlashCommandBuilder } = require('@discordjs/builders');
exports.data = new SlashCommandBuilder()
  .setName('commands')
  .setDescription('See all available commands.')