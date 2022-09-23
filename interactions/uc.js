const Discord = require("discord.js");
exports.execute = (client, interaction) => {


  let menu = new Discord.MessageSelectMenu()
    .setCustomId('selectMatches')
    .setPlaceholder('Select matches.')
    .setMinValues(1)
    .setMaxValues(1);



  const puppeteer = require('puppeteer');      // Require Puppeteer module
  const url = `https://liquipedia.net/wildrift/Liquipedia:Upcoming_and_ongoing_matches`;        // Set website you want to screenshot
  const loadingEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Ongoing and upcoming matches")
    .setDescription(`<a:Loading:900575343839150170> Loading ...`)

  interaction.reply({ embeds: [loadingEmbed] })

  const data = async () => {             // Define Screenshot function

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });  // Launch a "browser"
    const page = await browser.newPage();      // Open new page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });                      // Go website
    try {
      await page.waitForSelector('#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1)', { timeout: 1000 });
    }
    catch (e) {
      const errorEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("ERROR")
        .setDescription(`An error occured.`)
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor("ongoing and upcoming")
      .setTitle("**Popular Leagues and Matches**")
      .setDescription(`<a:Blue_Arrow_SouthEast:890836403997511772> [choose and see details](${url})`)
      .setTimestamp()

    let rows = await page.$$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table`)
    let count = rows.length <= 25 ? rows.length : 25


    for (var i = 1; i <= count; i++) {

      try {
        let leftTeamelement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-left > span > span.team-template-text > a`)
        leftTeam = await page.evaluate(el => el.textContent, leftTeamelement)
      }
      catch (e) {
        leftTeam = 'TBD'
      }
      try {
        let rightTeamelement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-right > span > span.team-template-text > a`)
        rightTeam = await page.evaluate(el => el.textContent, rightTeamelement)
      }
      catch (e) {
        rightTeam = 'TBD'
      }

      try {
        let leftTeamLinkElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-left > span > span.team-template-text > a`, { waitUntil: 'domcontentloaded', timeout: 0 })
        leftTeamLinkSRC = await page.evaluate(el => el.getAttribute('href'), leftTeamLinkElement)
        leftTeamLink = 'https://liquipedia.net' + leftTeamLinkSRC
      }
      catch (e) {
        leftTeamLink = ''
      }
      try {
        let rightTeamLinkElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.team-right > span > span.team-template-text > a`, { waitUntil: 'domcontentloaded', timeout: 0 })
        rightTeamLinkSRC = await page.evaluate(el => el.getAttribute('href'), rightTeamLinkElement)
        rightTeamLink = 'https://liquipedia.net' + rightTeamLinkSRC
      }
      catch (e) {
        rightTeamLink = ''
      }

      try {
        let watchLinkelement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.matches-list.toggle-area-1 > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(2) > td > span > span`)


        try {
          let facebookURL = await page.evaluate(el => el.getAttribute('data-stream-facebook'), watchLinkelement)
          facebook = 'https://liquipedia.net/wildrift/Special:Stream/facebook/' + facebookURL.replace(' ', '_');

        } catch (e) { facebook = null }
        try {
          let youtubeURL = await page.evaluate(el => el.getAttribute('data-stream-youtube'), watchLinkelement)
          youtube = 'https://liquipedia.net/wildrift/Special:Stream/youtube/' + youtubeURL.replace(' ', '_');
        } catch (e) { youtube = null }
        try {
          let twitchURL = await page.evaluate(el => el.getAttribute('data-stream-twitch'), watchLinkelement)
          twitch = 'https://liquipedia.net/wildrift/Special:Stream/twitch/' + twitchURL.replace(' ', '_');
        } catch (e) { twitch = null }
        try {
          let douyuURL = await page.evaluate(el => el.getAttribute('data-stream-douyu'), watchLinkelement)
          douyu = 'https://liquipedia.net/wildrift/Special:Stream/douyu/' + douyuURL.replace(' ', '_');
        } catch (e) { douyu = null }




      }
      catch (e) {
        youtube = null
        facebook = null
        twitch = null
        douyu = null
      }


      let vsInfoElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.versus > div:nth-child(1)`)
      let vs = await page.evaluate(el => el.textContent, vsInfoElement)

      try {
        let boInfoElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(1) > td.versus > div:nth-child(2) > abbr`)
        bo = await page.evaluate(el => el.textContent, boInfoElement)
      }catch (e) { bo = "TBA"  }


      let leagueElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(2) > td > div > div > a`)
      let league = await page.evaluate(el => el.textContent, leagueElement)
      let leaguelink = await page.evaluate(el => el.getAttribute('href'), leagueElement)

      let timeElement = await page.$(`#mw-content-text > div > div.panel-box.wiki-bordercolor-light.toggle-area.toggle-area-1.matches-list > div:nth-child(2) > div:nth-child(1) > table:nth-child(${i}) > tbody > tr:nth-child(2) > td > span > span`)
      let time = await page.evaluate(el => el.getAttribute('data-timestamp'), timeElement)
      let countdown = `<t:${time}:R>`
      
      const currentTime = Math.floor(Date.now() / 1000)
  
      if (currentTime >= time) {
        countdown = "**LIVE!**"
      }

      let data = {
        value: `${i}`,
        result: `${vs.trim()}`,
        title: `[**${leftTeam}**](${leftTeamLink}) **${vs.trim()}** [**${rightTeam}**](${rightTeamLink})`,
        description: `**${bo.trim()}**\n[${league}](https://liquipedia.net${leaguelink})\n<t:${time}:f> | ${countdown}`,
        facebook,
        youtube,
        twitch,
        douyu
      }
      await client.menuoptionData.push(data)
      menu.addOptions([
        {
          label: `${leftTeam} ${vs.trim()} ${rightTeam}`,
          description: `${bo.trim()} | ${league}`,
          value: `${client.menuoptionData.indexOf(data)}`,
          emoji: '<:wildriftlogo:890079250395332698>'
        }
      ])
    }

    let row = new Discord.MessageActionRow().addComponents(menu);



    await interaction.editReply({ embeds: [embed], components: [row], files: [] });


  }




  data()

}


const { SlashCommandBuilder } = require('@discordjs/builders');
exports.data = new SlashCommandBuilder()
  .setName('uc')
  .setDescription('Find upcoming and ongoing matches.')
