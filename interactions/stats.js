const Discord = require("discord.js");

exports.execute = (client, interaction) => {
  let gameModetext = interaction.options.getString("gamemode").toLowerCase();

  if (!gameModetext || !client.config.gameMode[gameModetext]) {
    const gameModeEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Please enter the game mode correctly.`);

    return interaction.reply({ embeds: [gameModeEmbed] });
  }

  let tiertext = interaction.options.getString("tier");
  if (!tiertext) {
    tiertext = "all_tiers";
  } else if (!client.config.tier[tiertext]) {
    const tierEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Please enter the tier correctly.`);

    return interaction.reply({ embeds: [tierEmbed] });
  } else if (client.config.tier[tiertext]) {
    tiertext = tiertext.toLowerCase();
  }

  let regiontext = interaction.options.getString("region").toLowerCase();
  if (regiontext) {
    regiontext = regiontext.toLowerCase();
  }
  if (!regiontext || !client.config.region[regiontext]) {
    const regionEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Please enter the region correctly.\neu/na/sea`);

    return interaction.reply({ embeds: [regionEmbed] });
  }

  const loadingEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Stats")
    .setDescription(
      `<a:Loading:900575343839150170> Loading stats of *${gameModetext.toUpperCase()}* | *${client.config.region[
        regiontext
      ].toUpperCase()}* | *${tiertext.toUpperCase()}* ...`
    );

  interaction.reply({ embeds: [loadingEmbed] });

  const errorEmbed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("ERROR")
    .setDescription(`Unknown error.`);

  const puppeteer = require("puppeteer"); // Require Puppeteer module
  const url = `https://${client.config.region[
    regiontext
  ].toLowerCase()}.wildstats.gg/en/champions/statistics?gameMode=${
    client.config.gameMode[gameModetext]
  }&tierId=${client.config.tier[tiertext]}&daysCount=1`; // Set website you want to screenshot
  const Screenshot = async () => {
    // Define Screenshot function
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    }); // Launch a "browser"
    const page = await browser.newPage(); // Open new page
    await page.goto(url, { waitUntil: "load", timeout: 0 }); // Go website
    try {
      await page.waitForSelector("#characterList", { timeout: 1000 });
    } catch (e) {
      return interaction.editReply({ embeds: [errorEmbed] });
    }
    // Method to ensure that the element is loaded
    const logo = await page.$("#characterList"); // logo is the element you want to capture
    const box = await logo.boundingBox(); // this method returns an array of geometric parameters of the element in pixels.
    const x = box["x"]; // coordinate x
    const y = box["y"]; // coordinate y
    const w = box["width"]; // area width
    const h = box["height"]; // area height

    const screenshot = await page.screenshot({
      clip: { x: x, y: y, width: w, height: 975.5 }, //975.5 height for half
    }); // take screenshot of the required area in puppeteer

    await page.close(); // Close the website
    await browser.close(); // Close the browser

    const file = new Discord.MessageAttachment(screenshot);

    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Full list: [WildStats](${url})`)
      .setTitle(
        `STATS: ${gameModetext.toUpperCase()} | ${client.config.region[
          regiontext
        ].toUpperCase()} | ${tiertext.toUpperCase()}`
      )
      .setImage(`attachment://file.jpg`)
      .setFooter("Day count: 1 day");

    await interaction.editReply({ embeds: [embed], files: [file] });
  };

  Screenshot();
};

const { SlashCommandBuilder } = require("@discordjs/builders");
exports.data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription(
    "Champion pick  rate, winrate, games stats from wildstats.gg #EU."
  )
  .addStringOption((option) =>
    option
      .setName("gamemode")
      .setDescription("Ranked/ RankedDuo/ PvP/ ARAM")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("region").setDescription("EU/NA/SEA").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("tier").setDescription("Rank tier.").setRequired(false)
  );
