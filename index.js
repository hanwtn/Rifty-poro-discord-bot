const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Intents } = require("discord.js");
require("dotenv").config();

const myIntents = new Intents();
myIntents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGES
);

const client = new Client({ intents: myIntents, partials: ["CHANNEL"] });

const { EconomyManager } = require("quick.eco");
client.eco = new EconomyManager({
  adapter: "mongo",
  adapterOptions: {
    collection: "money", // => Collection Name
    uri: process.env.mongoEcoUri, // => Mongodb uri
  },
});

const { Collection: MongoCollection, MongoClient } = require("mongodb");
const { Collection, Fields } = require("quickmongo");

const mongo = new MongoClient(process.env.mongoProfUri);
const schema = new Fields.ObjectField({
  guildprefix: new Fields.StringField(),
  profile: new Fields.StringField(),
  //items: new Fields.ArrayField(new Fields.StringField()),
  //balance: new Fields.NumberField()
});

mongo.connect().then(() => {
  console.log("Connected to the database!");
});

const mongoCollection = mongo.db().collection("JSON");
client.db = new Collection(mongoCollection, schema);

client.poro = require("./poroConfig");
client.config = require("./botConfig");
client.admincommands = new Discord.Collection();
client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();
client.aliases = new Discord.Collection();

client.menuoptionData = [];

const fs = require("fs");

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((f) => {
    if (!f.endsWith(".js")) return;
    const event = require(`./events/${f}`);
    let eventName = f.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((f) => {
    if (!f.endsWith(".js")) return;
    let command = require(`./commands/${f}`);
    let commandName = f.split(".")[0];
    client.commands.set(commandName, command);
    command.help.aliases.forEach((alias) => {
      client.aliases.set(alias, commandName);
    });
  });
});

fs.readdir("./interactions/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((f) => {
    if (!f.endsWith(".js")) return;
    let command = require(`./interactions/${f}`);
    let commandName = f.split(".")[0];
    client.interactions.set(commandName, command);
  });
});

const slashcommands = [];

const interactionFiles = fs
  .readdirSync("./interactions/")
  .filter((file) => file.endsWith(".js"));

for (const file of interactionFiles) {
  const interaction = require(`./interactions/${file}`);

  slashcommands.push(interaction.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.clientID), {
      body: slashcommands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

//###########  TWITTER #################

const Twitter = require("twit");
const twitterConf = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

const twitterClient = new Twitter(twitterConf);
// Specify destination channel ID below
const dest = client.guilds.cache;

// Create a stream to follow tweets
const stream = twitterClient.stream("statuses/filter", {
  follow: "1171151232636878848", // specify whichever Twitter ID you want to follow
});

stream.on("tweet", (tweet) => {
  var url =
    "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
  if (tweet.user.id_str === "1171151232636878848") {
    if (
      tweet.in_reply_to_status_id ||
      tweet.in_reply_to_status_id_str ||
      tweet.in_reply_to_user_id ||
      tweet.in_reply_to_user_id_str ||
      tweet.in_reply_to_screen_name
    )
      return;

    let status = "Tweeted";
    if (tweet.retweeted || tweet.retweeted_status) {
      status = "Retweeted";
    }

    /*
        const embed = new Discord.MessageEmbed()
          .setAuthor(`${tweet.user.name}`, tweet.user.profile_image_url_https)
          .setTitle("<:Twitter:891599190516457492> " + status)
          .setURL(url)
          .setColor("BLUE")
          .addField("<a:Heart_Love:891599385375420437> " + tweet.favorite_count, "<:retweet:891598988086743040> " + tweet.retweet_count)
          .setFooter("https://riftyporo.vercel.app")
          .setDescription(tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text)
          .setTimestamp();
        if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url);
    
        dest.forEach(g => {
    
          let channel = client.db.get(`twitter_${g.id}`)
          if (!channel) return
          try {
    
            client.channels.cache.get(channel).send({ embeds: [embed] }).then((m) => {
              m.react('<a:Heart_Love:891599385375420437>');
              timeout();
    
              function timeout() {
                setTimeout(function () {
    
                  twitterClient.get('statuses/show/:id', { id: tweet.id_str }, function (err, data, response) {
    
    
                    embed.fields[0] = {
                      name: "<a:Heart_Love:891599385375420437> " + data.favorite_count,
                      value: "<:retweet:891598988086743040> " + data.retweet_count
                    }
    
    
                    m.edit({ embeds: [embed] })
    
                  })
                  timeout();
                }, 300000);
              }
    
            })
          } catch (e) { }
        })
      }
    
    */
    dest.forEach(async (g) => {
      let channel = await client.db.get(`twitter_${g.id}`, "profile");
      if (!channel) return;
      try {
        client.channels.cache
          .get(channel)
          .send({ content: `${status} ${url}` });
      } catch (e) {}
    });
  }
});

client.login(client.config.token);
process.on("unhandledRejection", (err) => {
  console.error(err);
});
process.on('uncaughtException', function (error) {
   console.log(error.stack);
});

// Just trying to restart
setTimeout(function () {
   process.exit(0);
 }, 900000);
