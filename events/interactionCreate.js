const Discord = require("discord.js");
var Jimp = require("jimp");
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
} = require("discord.js");
module.exports = async (client, interaction) => {
  if (!interaction.guild) {
    if (interaction.commandName == "save") {
      let command = client.interactions.get(interaction.commandName);
      return command.execute(client, interaction);
    } else {
      return interaction.reply("You can't use this command in DM.");
    }
  }

  client.prefix = (await client.db.get(
    `prefix_${interaction.guild.id}`,
    "guildprefix"
  ))
    ? await client.db.get(`prefix_${interaction.guild.id}`, "guildprefix")
    : client.config.prefix;

  if (interaction.isCommand()) {
    let command = client.interactions.get(interaction.commandName);

    command.execute(client, interaction);
  }

  if (interaction.isSelectMenu()) {
    if (interaction.customId === "selectMatches") {
      try {
        /*
          let image = await Jimp.read('matchtemplate.png');
          image = image.resize(1875,300);
          let  leftImage = await Jimp.read(`${client.menuoptionData[interaction.values].leftImage}`);
          
          
          leftImage = await leftImage
          leftImage = leftImage.resize(150,150);
          image.composite(leftImage, 318.75, 75, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 1
          })
    
    
          let  rightImage = await Jimp.read(`${client.menuoptionData[interaction.values].rightImage}`);
          
          rightImage = await rightImage
          rightImage = rightImage.resize(150,150);
          image.composite(rightImage, 1406.25, 75, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 1
          })
    	
          await image.writeAsync('match.png')
    
        const fileMatch = new Discord.MessageAttachment('match.png')
    */

        const embed = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setTitle("Match Info")
          .setDescription(
            client.menuoptionData[interaction.values].title +
              "\n" +
              client.menuoptionData[interaction.values].description
          )
          .setImage(`attachment://match.png`)
          .setTimestamp()
          .setFooter("source: liquipedia.net");
        if (client.menuoptionData[interaction.values].twitch) {
          embed.addField(
            "Watch link",
            `[Twitch](${client.menuoptionData[interaction.values].twitch})`,
            true
          );
        }
        if (client.menuoptionData[interaction.values].youtube) {
          embed.addField(
            "Watch link",
            `[Youtube](${client.menuoptionData[interaction.values].youtube})`,
            true
          );
        }
        if (client.menuoptionData[interaction.values].facebook) {
          embed.addField(
            "Watch link",
            `[Facebook](${client.menuoptionData[interaction.values].facebook})`,
            true
          );
        }
        if (client.menuoptionData[interaction.values].douyu) {
          embed.addField(
            "Watch link",
            `[Douyu](${client.menuoptionData[interaction.values].douyu})`,
            true
          );
        }

        await interaction.update({ embeds: [embed] });
      } catch (e) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(`ERROR`)
          .setDescription(`An error occured. Please retry.`)
          .setTimestamp()
          .setFooter("source: liquipedia.net");

        await interaction.update({ embeds: [errorEmbed], components: [] });
      }
    }
    if (interaction.customId === "buyPoro") {
      const chosenPoro = interaction.values[0];
      let buyButtonID = chosenPoro;
      const buyButton = new MessageButton({
        style: "SECONDARY",
        lable: `PAY ${client.poro[chosenPoro].cost}`,
        emoji: "<a:Blue_Arrow_Right:902153831511646230>",
        customId: buyButtonID,
      });
      await interaction.update({
        components: [new MessageActionRow({ components: [buyButton] })],
      });
    }
  }
};
