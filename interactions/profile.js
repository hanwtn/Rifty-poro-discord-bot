const { MessageEmbed, version } = require("discord.js");

exports.execute = async (client, interaction) => {
  const region = interaction.options.getString("region");
  if (region) {
    region = region.toLowerCase();
  }
  const clientKey = interaction.options.getString("game-tag");
  let userProfile = await client.db.get(interaction.member.id, "profile");
  let verified = await client.db.get(interaction.member.id, "guildprefix");
  let owner = interaction.member.id;

  if (region) {
    if (!client.config.region[region]) {
      const regionEmbed = new MessageEmbed()
        .setColor("RED")
        .setTitle("ERROR")
        .setDescription(
          `Please enter your region correctly.\nAvailable regions: **EU/NA/SEA**`
        )
        .setFooter(
          `r!save to read instructions.\nOr, try alter method: ${client.prefix}savewithlink.`
        );

      return message.reply({ embeds: [regionEmbed] });
    }
    if (!clientKey) {
      const tokenEmbed = new MessageEmbed()
        .setColor("RED")
        .setTitle("ERROR")
        .setDescription(`Command is missing region or in-game tag.`);

      return interaction.reply({ embeds: [tokenEmbed] });
    }
    userProfile = `https://${client.config.region[region]}.wildstats.gg/en`;
  }

  if (!userProfile) {
    return interaction.reply(
      `Enter region and game-tag or ${client.prefix}save to save your profile first.`
    );
  }

  const puppeteer = require("puppeteer");
  const loading = new MessageEmbed()
    .setColor("WHITE")
    .setDescription(`<a:Loading:900575343839150170> Loading ...`)
    .setFooter(
      `Save your profile first for faster respond.\nIf loading time is taking too long, Try alter method: ${client.prefix}savewithlink or feel free to join the support server for help.`
    );
  const Profile = async () => {
    await interaction.reply({ embeds: [loading] });
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const url = userProfile;

      const page = await browser.newPage(); // Open new page
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
      try {
        await page.waitForSelector("body", {
          waitUntil: "domcontentloaded",
          timeout: 0,
        });
      } catch (e) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle("ERROR")
          .setDescription(
            `An error occured.\n If you still need help, join [the support server](https://discord.gg/xGYHcShmCN) and We will help you linking your account.`
          );
        return interaction.editReply({ embeds: [errorEmbed] });
      }

      if (clientKey) {
        try {
          await page.click("body > nav > div > button");
          await page.waitForSelector("input[name=gameid]");

          await page.type("#puuidTextField", clientKey);

          await page.click(
            "#puuidForm > div > div.input-group-append > button"
          );

          await page.waitForNavigation({
            waitUntil: "domcontentloaded",
            timeout: 20000,
          });
          userProfile = page.url();
        } catch (e) {
          const errorEmbednav = new MessageEmbed()
            .setColor("RED")
            .setTitle("PROFILE NOT FOUND!")
            .setDescription(
              "An error occured. Make sure you set the right region and in-game tag. If you still need help, join [the support server](https://discord.gg/xGYHcShmCN) and We will help you linking your account."
            )
            .setFooter(
              `Try alter method: ${client.prefix}savewithlink or join the support server.`
            );

          return interaction.editReply({
            content: " ",
            embeds: [errorEmbednav],
          });
        }
      }

      try {
        let element1 = await page.$(
          "body > div.container-fluid.p-0.bg-header-small > div > div > div.col-12.col-sm-9.text-center.text-sm-left.align-self-sm-center.order-2.order-sm-2 > h3"
        );
        let value1 = await page.evaluate((el) => el.textContent, element1);
        let element2 = await page.$(
          "body > div.container-fluid.p-0.bg-header-small > div > div > div.col-12.col-sm-9.text-center.text-sm-left.align-self-sm-center.order-2.order-sm-2 > div"
        );
        let value2 = await page.evaluate((el) => el.textContent, element2);
        let element3 = await page.$("#battleStats_WinRate");
        let value3 = await page.evaluate((el) => el.textContent, element3);
        let element4 = await page.$("#battleStats_MVP");
        let value4 = await page.evaluate((el) => el.textContent, element4);
        let element5 = await page.$("#battleStats_Played");
        let value5 = await page.evaluate((el) => el.textContent, element5);
        let element6 = await page.$("#battleStats_Kda");
        let value6 = await page.evaluate((el) => el.textContent, element6);
        let element7 = await page.$("#battleStats_Teamfight");
        let value7 = await page.evaluate((el) => el.textContent, element7);
        let element8 = await page.$("#battleStats_GoldPerMinute");
        let value8 = await page.evaluate((el) => el.textContent, element8);
        let element9 = await page.$("#battleStats_DamageDealt");
        let value9 = await page.evaluate((el) => el.textContent, element9);
        let element10 = await page.$("#battleStats_DamageTaken");
        let value10 = await page.evaluate((el) => el.textContent, element10);
        let element11 = await page.$("#battleStats_DamageDealtToTowers");
        let value11 = await page.evaluate((el) => el.textContent, element11);
        let element12 = await page.$(
          "body > div.container-fluid.p-0.bg-header-small > div > div > div.col-12.col-sm-3.align-self-sm-center.text-center.order-1.order-sm-2 > img"
        );
        let value12 = await page.evaluate(
          (el) => el.getAttribute("src"),
          element12
        );
        let element13 = await page.$(
          "body > div.container-fluid.p-0.bg-header-small > div > div > div.col-12.col-sm-3.align-self-sm-center.text-center.order-1.order-sm-2 > span"
        );
        let value13 = await page.evaluate((el) => el.textContent, element13);

        let rows = await page.$$(
          `body > div:nth-child(11) > table > tbody > tr`
        );
        let count = rows.length <= 13 ? rows.length : 13;

        var recentMatches = "";
        for (var i = 1; i <= count; i++) {
          let leftTeamelement = await page.$(
            `body > div:nth-child(11) > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > span`
          );
          let status = await page.evaluate(
            (el) => el.textContent,
            leftTeamelement
          );

          matchStatus = "<:unknown_status:891259096500674600>";

          if (status.toLowerCase() === "win") {
            matchStatus = "<:green_status:891245854852284456>";
          }
          if (status.toLowerCase() === "loss") {
            matchStatus = "<:red_status:891246119735160833>";
          }

          recentMatches += matchStatus;
        }
        if (!recentMatches) {
          recentMatches = "Hidden match history.";
        }
        await page.close(); // Close the website
        await browser.close(); // Close the browser

        const embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(`<:profile:902748333448245278> ${value1} | ${value2}`)
          .setURL(userProfile)
          .setDescription(`<:rank:902765149436391434> **${value13}**`)
          .addField("<:winrate:902758678527107133> **Win Rate**", value3, true)
          .addField("<:MVP:902760441497931826> **MVP**", value4, true)
          .addField(
            "<:matches:902750389575762001> **Matches Played**",
            value5,
            true
          )
          .addField("<:KDA:902757834930917446> **KDA**", value6, true)
          .addField(
            "<:teamfight:902758087906168882> **Teamfight**",
            value7,
            true
          )
          .addField("<:gold:902752132514598932> **GPM**", value8, true)
          .addField(
            "<:damage:902757597273276437> **Damage Dealt**",
            value9,
            true
          )
          .addField(
            "<:damagetaken:902751750849720430> **Damage Taken**",
            value10,
            true
          )
          .addField(
            "<:tower:902760649724145665> **Damage Dealt To Towers**",
            value11,
            true
          )
          .addField(
            "<:wildriftlogo:890079250395332698> **Recent Matches**",
            recentMatches,
            false
          )
          .setThumbnail(value12);

        if (verified === "auth") {
          embed.addField(
            "<:pastel_verified:906521864984223844> verified account",
            `<@${owner}> owns this account.`
          );
        }
        if (verified !== "auth") {
          embed.addField(
            "<:dash_darkishblue:902413201512235048> unverified account",
            "Do r!login to verify."
          );
        }
        return interaction.editReply({
          content: "Here are your stats.",
          embeds: [embed],
        });
      } catch (e) {
        return interaction.editReply({
          content: `⚠ Unknown error occured. May be the acoount doesn't exist.\nTry alter method: ${client.prefix}savewithlink or feel free to join the support server for help.`,
          embeds: [],
        });
      }
    } catch (e) {
      return interaction.editReply({
        content: `⚠ Unknown error occured. May be the acoount doesn't exist.\nTry alter method: ${client.prefix}savewithlink or feel free to join the support server for help.`,
        embeds: [],
      });
    }
  };

  Profile();
};

const { SlashCommandBuilder } = require("@discordjs/builders");
exports.data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("See your saved in-game profile.")
  .addStringOption((option) =>
    option
      .setName("region")
      .setDescription("Your account's region.")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("game-tag")
      .setDescription(`Your in-game name tag.`)
      .setRequired(false)
  );
