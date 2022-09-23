const Discord = require("discord.js");

exports.execute = (client, message, args) => {

  let menu = new Discord.MessageSelectMenu()
    .setCustomId('selectMatches')
    .setPlaceholder('Select matches.')
    .setMinValues(1)
    .setMaxValues(1);


  const puppeteer = require('puppeteer');      // Require Puppeteer module
  const url = `https://liquipedia.net/wildrift/Liquipedia:Upcoming_and_ongoing_matches`;        // Set website you want to screenshot
  const loadingEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Concluded matches")
    .setDescription(`<a:Loading:900575343839150170> Loading ...`)

  message.reply({ embeds: [loadingEmbed] }).then(msg => {

    const data = async () => {             // Define Screenshot function

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });  // Launch a "browser"
      const page = await browser.newPage();      // Open new page
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });                      // Go website
      try {
        await page.waitForSelector('#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list', { waitUntil: 'domcontentloaded', timeout: 0 });
      }
      catch (e) {
        console.log(e)
        const errorEmbed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle("ERROR")
          .setDescription(`An error occured.`)
        return msg.edit({ embeds: [errorEmbed] });
      }


      const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor("concluded")
        .setTitle("**Popular Leagues and Matches**")
        .setDescription(`<a:Blue_Arrow_SouthEast:890836403997511772> [choose and see details](${url})`)
        .setTimestamp()

      let rows = await page.$$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table`)
      let count = rows.length <= 25 ? rows.length : 25


      for (var i = 1; i <= count; i++) {

        let leftTeamelement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-left > span > span.team-template-text > a`)
        let leftTeam = await page.evaluate(el => el.textContent, leftTeamelement)

        let rightTeamelement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-right > span > span.team-template-text > a`)
        let rightTeam = await page.evaluate(el => el.textContent, rightTeamelement)


        try {
          let leftTeamLinkElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-left > span > span.team-template-text > a`, { waitUntil: 'domcontentloaded', timeout: 0 })
          leftTeamLinkSRC = await page.evaluate(el => el.getAttribute('href'), leftTeamLinkElement)
          leftTeamLink = 'https://liquipedia.net' + leftTeamLinkSRC
        }
        catch (e) {
          leftTeamLink = ''
        }
        try {
          let rightTeamLinkElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-right > span > span.team-template-text > a`, { waitUntil: 'domcontentloaded', timeout: 0 })
          rightTeamLinkSRC = await page.evaluate(el => el.getAttribute('href'), rightTeamLinkElement)
          rightTeamLink = 'https://liquipedia.net' + rightTeamLinkSRC
        }
        catch (e) {
          rightTeamLink = ''
        }


        let vsInfoElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.versus`)
        let vs = await page.evaluate(el => el.textContent, vsInfoElement)


        let leagueElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(2) > td > div > div > a`)
        let league = await page.evaluate(el => el.textContent, leagueElement)
        let leaguelink = await page.evaluate(el => el.getAttribute('href'), leagueElement)




        let timeElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(2) > td > span > span`)
        let time = await page.evaluate(el => el.getAttribute('data-timestamp'), timeElement)

        const currentTime = Math.floor(Date.now() / 1000)
        let args = vs.trim().split(":");
        let leftTeamScore = args[0];
        let rightTeamScore = args[1];

        let winner = ""
        if (leftTeamScore !== rightTeamScore) {
          let winnerInfoElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(3) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.versus > b`)
          winner = await page.evaluate(el => el.textContent, winnerInfoElement)
        }

        let winnerTeam = "draw"
        if (winner.toString() === leftTeamScore) {
          leftTeamScore = `__${args[0]}__`
          winnerTeam = leftTeam
        }
        if (winner.toString() === rightTeamScore) {
          rightTeamScore = `__${args[1]}__`
          winnerTeam = rightTeam
        }


        let data = {
          value: `${i}`,
          result: `${vs.trim()}`,
          title: `[**${leftTeam}**](${leftTeamLink}) **${vs.trim()}** [**${rightTeam}**](${rightTeamLink})`,
          description: `Winner: **${winnerTeam}**\n[${league}](https://liquipedia.net${leaguelink})\n<t:${time}:f> `
        }

        await client.menuoptionData.push(data)

        menu.addOptions([
          {
            label: `${leftTeam} ${vs.trim()} ${rightTeam}`,
            description: `${league}`,
            value: `${client.menuoptionData.indexOf(data)}`,
            emoji: '<:wildriftlogo:890079250395332698>'
          }
        ])
      }

      let row = new Discord.MessageActionRow().addComponents(menu);


      await msg.edit({ embeds: [embed], components: [row], files: [] });

    }




    data()
  })

}

exports.help = {
  name: "Concluded matches",
  aliases: ["conclud", "concluded", "concludedmatch", "c"],
  usage: `concluded`,
  info: "The results of recently concluded league matches."
}


