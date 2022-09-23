const { MessageEmbed } = require("discord.js");
const jwt = require("jwt-decode");
exports.execute = (client, interaction) => {
  const embed = new MessageEmbed()
    .setAuthor("Rifty Poro")
    .setDescription(
      `Instructions:\n> 1. Log in via [**Riot's official auth**](https://auth.riotgames.com/login#client_id=wildrift-client&redirect_uri=http%3A%2F%2Flocalhost%2Fredirect&response_type=token%20id_token&scope=openid%20email%20summoner&nonce=aaaaaaaaaaaaaaaaaaaaaa).\n> 2. After login, it will show 'This site can't be reached' or 'Error'. Don't worry. Copy the address bar which starts with \"**localhost**\".\n> 3. Type **r!login <EU/SEA/NA> <the copied address>** here(DM) or use the slash command.`
    )
    .setColor("WHITE")
    .setFooter(
      "The auth tokens are credentials, which can grant access to resources. Be careful where you paste them! We do not record tokens."
    );
  //.setFooter("Rifty Poro isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Wild Rift. Wild Rift and Riot Games are trademarks or registered trademarks of Riot Games, Inc. Wild Rift © Riot Games, Inc.")

  let region = interaction.options.getString("region");
  const clientKey = interaction.options.getString("token");
  if (region) {
    region = region.toLowerCase();
  }
  if (!region || !client.config.region[region]) {
    const regionEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Please enter your region correctly.\n**eu/na/sea**`)
      .setFooter(`${client.prefix}savewithlink to read instructions.`);

    return interaction.reply({ embeds: [regionEmbed] });
  }

  if (!clientKey) {
    const tokenEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("ERROR")
      .setDescription(`Please enter your token.`)
      .setFooter(`${client.prefix}savewithlink to read instructions.`);

    return interaction.reply({ embeds: [tokenEmbed] });
  }

  const puppeteer = require("puppeteer");
  const Get = async () => {
    await interaction.reply("<a:Loading:900575343839150170> Loading ...");
    try {
      const decoded = jwt(clientKey);
      const clientKeySub = decoded.sub;
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const url = `https://${client.config.region[region]}.wildstats.gg/en/help/accountid`;

      const page = await browser.newPage(); // Open new page
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

      await page.waitForSelector("input[name=gameid]");

      await page.type(
        "body > div.container-fluid.p-0.bg-header.bg-header-landscape1 > div.container.p-3.p-sm-4.bg-feature.bg-shadow > form > div > input.form-control.py-2.col-12.col-md-3",
        clientKeySub
      );

      await page.click(
        "body > div.container-fluid.p-0.bg-header.bg-header-landscape1 > div.container.p-3.p-sm-4.bg-feature.bg-shadow > form > div > span > button"
      );

      await page.waitForNavigation();

      let element = await page.$(
        "body > div.container-fluid.p-0.bg-header-small > div > div > div.col-12.col-sm-9.text-center.text-sm-left.align-self-sm-center.order-2.order-sm-2 > h3"
      );
      let value = await page.evaluate((el) => el.textContent, element);

      await client.db.set(message.author.id, {
        guildprefix: `auth`,
        profile: `${page.url()}`,
      });
      await page.close(); // Close the website
      await browser.close(); // Close the browser
      const successEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("SUCCESS!")
        .setDescription(
          `You have successfully linked your profile **${value}**.`
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
  .setName("savewithlink")
  .setDescription(
    `Save your in-game profile with Riot Auth. Type r!save to see instructions.`
  )
  .addStringOption((option) =>
    option
      .setName("region")
      .setDescription("Your account's region.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("token")
      .setDescription(`Your token from riot auth. Type r!save for details.`)
      .setRequired(true)
  );
