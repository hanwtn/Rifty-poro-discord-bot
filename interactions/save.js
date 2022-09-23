const { MessageEmbed } = require("discord.js");

exports.execute = async (client, interaction) => {
  let region = interaction.options.getString("region");
  const clientKey = interaction.options.getString("game-tag");
  if (region) {
    region = region.toLowerCase();
  }
  const puppeteer = require("puppeteer");
  const Get = async () => {
    await interaction.reply("<a:Loading:900575343839150170> Loading ...");
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const url = `https://${client.config.region[region]}.wildstats.gg/en`;

      const page = await browser.newPage(); // Open new page
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
      await page.click("body > nav > div > button");
      await page.waitForSelector("input[name=gameid]");

      await page.type("#puuidTextField", clientKey);

      await page.click("#puuidForm > div > div.input-group-append > button");

      await page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });

      let element = await page.$(
        "body > div.container-fluid.p-0.bg-header-small > div > div > div.col-12.col-sm-9.text-center.text-sm-left.align-self-sm-center.order-2.order-sm-2 > h3"
      );
      let value = await page.evaluate((el) => el.textContent, element);

      await client.db.set(message.member.id, {
        guildprefix: `0`,
        profile: `${page.url()}`,
      });
      await page.close(); // Close the website
      await browser.close(); // Close the browser
      const successEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("SUCCESS!")
        .setDescription(
          `<:Okay:891716048645140530>  You have successfully linked your profile **${value}**.`
        )
        .setFooter(
          "You can now use profile command to see your in-game profile and stats."
        );

      return interaction.editReply({ content: " ", embeds: [successEmbed] });
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setColor("RED")
        .setTitle("PROFILE NOT FOUND!")
        .setDescription(
          "An error occured. Make sure you set the right region and in-game tag. If you still need help, join [the support server](https://discord.gg/xGYHcShmCN) and We will help you linking your account."
        )
        .setFooter(
          `Try alter method: r!savewithlink or join the support server.`
        );

      return interaction.editReply({ content: " ", embeds: [errorEmbed] });
    }
  };

  Get();
};

const { SlashCommandBuilder } = require("@discordjs/builders");
exports.data = new SlashCommandBuilder()
  .setName("save")
  .setDescription(`Save your in-game profile. Type r!save to see instructions.`)
  .addStringOption((option) =>
    option
      .setName("region")
      .setDescription("Your account's region.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("game-tag")
      .setDescription(`Your in-game name tag.`)
      .setRequired(true)
  );
