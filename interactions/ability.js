const Discord = require("discord.js");

exports.execute = (client, interaction) => {
  let champion = interaction.options.getString("champion");

  if (!champion) {
    const championerrorEmbed = new Discord.MessageEmbed()
      .setTitle("ERROR")
      .setDescription(`Please enter the champion correctly.`)
      .setColor("RED");

    return interaction.reply({ embeds: [championerrorEmbed] });
  }
  champion = champion.toLowerCase();
  if (!client.config.mobafire[champion]) {
    client.config.wildriftfire[champion] = champion;
    client.config.wildriftguides[champion] = champion;
    client.config.rankedboost[champion] = champion;
    client.config.mobafire[champion] = champion;
  }

  const skillentered = interaction.options.getString("ability");
  if (!skillentered) {
    const skillerrorEmbed = new Discord.MessageEmbed()
      .setTitle("ERROR")
      .setDescription(`Please enter ability correctly.`)
      .setColor("RED");

    return interaction.reply({ embeds: [skillerrorEmbed] });
  }

  let skill = parseInt(skillentered) + 1;

  if (skillentered.toLowerCase() === "passive") {
    skill = "1";
  } else if (isNaN(skill)) {
    const skillerrorEmbed = new Discord.MessageEmbed()
      .setTitle("ERROR")
      .setDescription(`Please enter skill correctly.`)
      .setColor("RED");

    return interaction.reply({ embeds: [skillerrorEmbed] });
  }

  const loadingEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(champion.toUpperCase())
    .setDescription(
      `<a:Loading:900575343839150170> Loading ability ${skillentered} of *${champion.toUpperCase()}* ...`
    );

  interaction.reply({ embeds: [loadingEmbed] });

  const puppeteer = require("puppeteer");
  const url =
    "https://www.wildriftfire.com/guide/" +
    client.config.wildriftfire[champion];
  const data = async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage(); // Open new page
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 }); // Go website

    try {
      await page.waitForSelector(
        `#wrap > div.wf-champion.wm > div.wf-champion__chapters > div:nth-child(2) > div > div:nth-child(${skill})`,
        { timeout: 3000 }
      );
    } catch (e) {
      const errorEmbed = new Discord.MessageEmbed()
        .setTitle(champion.toUpperCase())
        .setDescription(champion.toUpperCase() + ` doesn't have this skill.`)
        .setColor("RED");

      return interaction.editReply({ embeds: [errorEmbed] });
    }
    try {
      let element = await page.$(
        `#wrap > div.wf-champion.wm > div.wf-champion__chapters > div:nth-child(2) > div > div:nth-child(${skill}) > div.chapter-ability-video > video > source:nth-child(2)`
      );
      let value = await page.evaluate((el) => el.getAttribute("src"), element);

      let element1 = await page.$(
        `#wrap > div.wf-champion.wm > div.wf-champion__chapters > div:nth-child(2) > div > div:nth-child(${skill}) > div.chapter-ability-text > div > h3`
      );
      let title = await page.evaluate((el) => el.textContent, element1);

      let element2 = await page.$(
        `#wrap > div.wf-champion.wm > div.wf-champion__chapters > div:nth-child(2) > div > div:nth-child(${skill}) > div.chapter-ability-text`
      );
      let description = await page.evaluate((el) => el.textContent, element2);

      let element3 = await page.$(
        `#wrap > div.wf-champion.wm > div.wf-champion__chapters > div:nth-child(2) > div > div:nth-child(${skill}) > div.chapter-ability-text > div > div > div > img`
      );
      let icon = await page.evaluate((el) => el.getAttribute("src"), element3);

      await page.close();
      await browser.close(); // Close the browser
      var titleAuthor = title.substring(
        title.indexOf("(") + 1,
        title.lastIndexOf(")")
      );
      const embed = new Discord.MessageEmbed()
        .setAuthor(
          champion.toUpperCase() + "'S " + titleAuthor.toUpperCase(),
          "https://www.mobafire.com/images/champion/square/" +
            client.config.mobafire[champion] +
            ".png"
        )
        .setDescription(description)
        .setImage("https://www.wildriftfire.com/" + value)
        .setColor("BLUE")
        .setThumbnail(icon)
        .addField("Source", "[WildRiftFire](" + url + ")");

      await interaction.editReply({ embeds: [embed] });

      if (value) {
        await interaction.followUp({
          content: "Demo: https://www.wildriftfire.com" + value,
        });
      }
    } catch (e) {
      const errorEmbed = new Discord.MessageEmbed()
        .setTitle(champion.toUpperCase())
        .setDescription(`Sorry. This content is not uploaded yet. Coming soon!`)
        .setColor("RED");

      return interaction.editReply({ embeds: [errorEmbed] });
    }
  };

  data();
};

const { SlashCommandBuilder } = require("@discordjs/builders");
exports.data = new SlashCommandBuilder()
  .setName("ability")
  .setDescription("See champion ability info.")
  .addStringOption((option) =>
    option
      .setName("champion")
      .setDescription("Champion name.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("ability")
      .setDescription("Ability number.\n0 or passive/ 1/ 2/ ...")
      .setRequired(true)
  );
