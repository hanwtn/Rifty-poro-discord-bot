exports.execute = async (client, message, args) => {
    let add = await client.eco.daily(message.author.id, false, 250);
    if (add.cooldown) return message.reply(`You already claimed your daily coins. Come back after ${add.time.hours} hours, ${add.time.minutes} minutes & ${add.time.seconds} seconds.`);
    return message.reply(`You claimed ${add.amount} as your daily coins and now you have total ${add.money.toLocaleString()} poro coins.`);
  }
  
  exports.help = {
    name: "Daily",
    aliases: ["daily"],
    usage: `daily`,
    info: "Claim your daily poro coins."
  }