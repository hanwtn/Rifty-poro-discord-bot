const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
  const embed = new MessageEmbed()
    .setAuthor("Rifty Poro")
    .setDescription(
      `Type \n**r!save <region> <game tag>** \nhere or DM or use the slash command.`
    )
    .setColor("WHITE")
    .setFooter(
      `If you need help, join the support server and we will help you linking your account.\nAlter method: ${client.prefix}savewithlink`
    )
    .setTimestamp();
  //.setFooter("Rifty Poro isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Wild Rift. Wild Rift and Riot Games are trademarks or registered trademarks of Riot Games, Inc. Wild Rift © Riot Games, Inc.")

  let region = args[0];
  if (region) {
    region = region.toLowerCase();
  }
  await args.shift();
  let argsString = await args.toString();
  argsString = await argsString.replace(/,/g, " ");
  const clientKey = argsString;

  if (!region) {
    return message.reply({ embeds: [embed] });
  }
  if (!region || !client.config.region[region]) {
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
      .setDescription(`Please enter your in-game tag.`)
      .setFooter(
        `r!save to read instructions.\nOr, try alter method: ${client.prefix}savewithlink.`
      );

    return message.reply({ embeds: [tokenEmbed] });
  }
  message.reply("<a:Loading:900575343839150170> Loading ...").then((m) => {
    const puppeteer = require("puppeteer");
    const Get = async () => {
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

        await client.db.set(message.author.id, {
          guildprefix: `0`,
          profile: `${page.url()}`,
        });
        await page.close(); // Close the website
        await browser.close(); // Close the browser
        const successEmbed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle("SUCCESS!")
          .setDescription(
            `<:Okay:891716048645140530>  You have successfully linked your profile **${value}**.\n[Click here to support the developer](https://www.buymeacoffee.com/hansdev)`
          )
          .setFooter(
            "You can now use profile command to see your in-game profile and stats."
          );

        return m.edit({ content: " ", embeds: [successEmbed] });
      } catch (e) {
        const errorEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle("PROFILE NOT FOUND!")
          .setDescription(
            "An error occured. Make sure you set the right region and in-game tag. If you still need help, join [the support server](https://discord.gg/xGYHcShmCN) and We will help you linking your account."
          )
          .setFooter(
            `Try alter method: ${client.prefix}savewithlink or join the support server.`
          );

        return m.edit({ content: " ", embeds: [errorEmbed] });
      }
    };

    Get();
  });
};

exports.help = {
  name: "Save",
  aliases: [],
  usage: `save`,
  info: "Save your in-game profile.",
};
