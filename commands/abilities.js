const Discord = require("discord.js");

exports.execute = async (client, message, args) => {
  const skillentered = args[args.length - 1];
  await args.pop();
  let argsString = await args.toString();
  argsString = await argsString.replaceAll(/,/g, "");
  let champion = argsString;

  if (!champion) {
    const championerrorEmbed = new Discord.MessageEmbed()
      .setTitle("ERROR")
      .setDescription(`Please enter the champion correctly.`)
      .setColor("RED");

    return message.reply({ embeds: [championerrorEmbed] });
  }
  champion = champion.toLowerCase();
  if (!client.config.mobafire[champion]) {
    client.config.wildriftfire[champion] = champion;
    client.config.wildriftguides[champion] = champion;
    client.config.rankedboost[champion] = champion;
    client.config.mobafire[champion] = champion;
  }

  if (!skillentered) {
    const skillerrorEmbed = new Discord.MessageEmbed()
      .setTitle("ERROR")
      .setDescription(`Please enter ability correctly.`)
      .setColor("RED");

    return message.reply({ embeds: [skillerrorEmbed] });
  }

  let skill = parseInt(skillentered) + 1;

  if (skillentered.toLowerCase() === "passive") {
    skill = "1";
  } else if (isNaN(skill)) {
    const skillerrorEmbed = new Discord.MessageEmbed()
      .setTitle("ERROR")
      .setDescription(`Please enter skill correctly.`)
      .setColor("RED");

    return message.reply({ embeds: [skillerrorEmbed] });
  }

  const loadingEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(champion.toUpperCase())
    .setDescription(
      `<a:Loading:900575343839150170> Loading ability ${skillentered} of *${champion.toUpperCase()}* ...`
    );

  message.reply({ embeds: [loadingEmbed] }).then((msg) => {
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

        return msg.edit({ embeds: [errorEmbed] });
      }
      try {
        let element = await page.$(
          `#wrap > div.wf-champion.wm > div.wf-champion__chapters > div:nth-child(2) > div > div:nth-child(${skill}) > div.chapter-ability-video > video > source:nth-child(2)`
        );
        let value = await page.evaluate(
          (el) => el.getAttribute("src"),
          element
        );

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
        let icon = await page.evaluate(
          (el) => el.getAttribute("src"),
          element3
        );

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

        await msg.edit({ embeds: [embed] }).then((m) => {
          if (value) {
            m.reply({
              content:
                "\n[Click here to support the developer](<https://www.buymeacoffee.com/hansdev>)\nDemo: https://www.wildriftfire.com" +
                value,
            });
          }
        });
      } catch (e) {
        const errorEmbed = new Discord.MessageEmbed()
          .setTitle(champion.toUpperCase())
          .setDescription(
            `Sorry. This content is not uploaded yet. Coming soon!`
          )
          .setColor("RED");

        return msg.edit({ embeds: [errorEmbed] });
      }
    };

    data();
  });
};

exports.help = {
  name: "Champion Ability",
  aliases: ["ability"],
  usage: `ability [champ] [ability number]`,
  info: "Specific champion's specific ability.\nAbility numbers: passive or 0, 1, 2, 3, ...",
};
