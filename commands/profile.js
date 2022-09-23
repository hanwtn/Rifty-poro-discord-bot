const { MessageEmbed, version } = require("discord.js");

exports.execute = async (client, message, args) => {
  const user = message.mentions.users.first();
  let region = args[0];
  if (region) {
    region = region.toLowerCase();
  }
  const length = args.length;
  await args.shift();
  let argsString = await args.toString();
  argsString = await argsString.replace(/,/g, " ");
  const clientKey = argsString;
  let userProfile = await client.db.get(message.author.id, "profile");
  let verified = await client.db.get(message.author.id, "guildprefix");
  let owner = message.author.id;
  if (!user && isNaN(region)) {
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

        return message.reply({ embeds: [tokenEmbed] });
      }
      userProfile = `https://${client.config.region[region]}.wildstats.gg/en`;
    }
  }
  if (user) {
    userProfile = await client.db.get(user.id, "profile");
    verified = await client.db.get(user.id, "guildprefix");
    owner = user.id;
    if (!userProfile) {
      return message.reply(`This user is not linked to this game account.`);
    }
  }
  if (!isNaN(region) && length === 1) {
    userProfile = await client.db.get(region, "profile");
    verified = await client.db.get(region, "guildprefix");
    owner = region;
    if (!userProfile) {
      return message.reply(`This user id is not linked to this game account.`);
    }
  }

  if (!userProfile) {
    return message.reply(
      `Enter region and game-tag or ${client.prefix}save to save your profile first.`
    );
  }
  const loading = new MessageEmbed()
    .setColor("WHITE")
    .setDescription(`<a:Loading:900575343839150170> Loading ...`)
    .setFooter(
      "Save your profile first for faster respond.\n If you still need help, join [the support server](https://discord.gg/xGYHcShmCN) and We will help you linking your account."
    );

  message.reply({ embeds: [loading] }).then((m) => {
    try {
      const puppeteer = require("puppeteer");
      const Profile = async () => {
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
            .setDescription(`An error occured.`);
          return m.edit({ embeds: [errorEmbed] });
        }
        if (!user) {
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

              return m.edit({ content: " ", embeds: [errorEmbednav] });
            }
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
            let statusElement = await page.$(
              `body > div:nth-child(11) > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > span`
            );
            let status = await page.evaluate(
              (el) => el.textContent,
              statusElement
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
          let verifyIcon = " ";
          if (verified === "auth") {
            verifyIcon = "<:pastel_verified:906521864984223844>";
          }

          const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`<:profile:902748333448245278> ${value1} | ${value2} ${verifyIcon}`)
            .setURL(userProfile)
            .setDescription(`<:rank:902765149436391434> **${value13}**`)
            .addField(
              "<:winrate:902758678527107133> **Win Rate**",
              value3,
              true
            )
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
            .addField(
              "Consider to",
              "\n[support the developer](https://www.buymeacoffee.com/hansdev)",
              false
            )
            .setThumbnail(value12);
          if (!clientKey) {
            if (verified === "auth") {
             
              let rankArgs = value13.split(" ");
              try {
                message.guild.members
                  .fetch(owner)
                  .then(async (user) => {
                   

                    const alreadyRole = [ "Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"];
                     
                      try{
                        for(i = 0; i < alreadyRole.length;i++){
                      let roleTeam1 = message.guild.roles.cache.find(
                        (role) => role.name === alreadyRole[i]
                      );
                      if(roleTeam1)
                      await user.roles.remove(roleTeam1);
                      }
                      var roleTeam = message.guild.roles.cache.find(
                        (role) =>
                          role.name.toLowerCase() === rankArgs[0].toLowerCase()
                      );
                      await user.roles.add(roleTeam);
                      }catch(e){}
                    
                    

                  
                   
                  })
                  .catch(console.error);
              } catch (e) {
                console.log(e);
              }
            }
         
          }
          return m.edit({ content: "Here are your stats.", embeds: [embed] });
        } catch (e) {
          console.log(e);
          return m.edit({
            content:
              "⚠ Unknown error occured.\nSeems like I cannot find your profile. Join the support server for more info and support.",
            embeds: [],
          });
        }
      };

      Profile();
    } catch (e) {
      console.log(e);
      return m.edit({
        content:
          "⚠ Unknown error occured. May be the acoount doesn't exist.\n If you still need help, join the support server and we will help you linking your account.",
        embeds: [],
      });
    }
  });
};

exports.help = {
  name: "profile",
  aliases: ["p"],
  usage: `profile [region]* [game-tag]*`,
  info: "Your saved in-game profile.",
};
