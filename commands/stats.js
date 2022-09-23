const Discord = require("discord.js");

exports.execute = (client, message, args) => {
  let gameModetext = args[0];

  if (!gameModetext || !client.config.gameMode[gameModetext.toLowerCase()]) {
    const gameModeEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(
        `Please enter the game mode correctly.\nAvailable modes: **Ranked/ RankedDuo/ PvP/ ARAM**`
      );

    return message.channel.send({ embeds: [gameModeEmbed] });
  }

  let tiertext = args[2];
  if (!tiertext) {
    tiertext = "all_tiers";
  } else if (!client.config.tier[tiertext]) {
    const tierEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Please enter the tier correctly.`);

    return message.channel.send({ embeds: [tierEmbed] });
  } else if (client.config.tier[tiertext]) {
    tiertext = tiertext.toLowerCase();
  }

  let regiontext = args[1];
  if (regiontext) {
    regiontext = regiontext.toLowerCase();
  }
  if (!regiontext || !client.config.region[regiontext.toLowerCase()]) {
    const regionEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(
        `Please enter the region correctly.\nAvailable regions: **EU/NA/SEA**`
      );

    return message.channel.send({ embeds: [regionEmbed] });
  }

  const loadingEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Stats")
    .setDescription(
      `<a:Loading:900575343839150170> Loading stats of *${gameModetext.toUpperCase()}* | *${client.config.region[
        regiontext.toLowerCase()
      ].toUpperCase()}* | *${tiertext.toUpperCase()}* ...`
    );

  message.channel.send({ embeds: [loadingEmbed] }).then((msg) => {
    const errorEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Unknown error.`);

    const puppeteer = require("puppeteer"); // Require Puppeteer module
    const url = `https://${client.config.region[
      regiontext.toLowerCase()
    ].toLowerCase()}.wildstats.gg/en/champions/statistics?gameMode=${
      client.config.gameMode[gameModetext.toLowerCase()]
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
        return msg.edit({ embeds: [errorEmbed] });
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
            regiontext.toLowerCase()
          ].toUpperCase()} | ${tiertext.toUpperCase()}`
        )
        .setImage(`attachment://file.jpg`)
        .setFooter("Day count: 1 day");

      await msg.edit({ embeds: [embed], files: [file] });
    };

    Screenshot();
  });
};

exports.help = {
  name: "Champion Stats",
  aliases: ["stat"],
  usage: `stat [gamemode] [region] [tier]*`,
  info: "Champion leaderboard and stats.",
};
