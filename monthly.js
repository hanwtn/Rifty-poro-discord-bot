exports.execute = async (client, message, args) => {
    let add = await client.eco.monthly(message.author.id, false, 10000);
    if (add.cooldown) return message.reply(`You already claimed your monthly coins. Come back after ${add.time.days} days, ${add.time.hours} hours, ${add.time.minutes} minutes & ${add.time.seconds} seconds.`);
    return message.reply(`You claimed ${add.amount.toLocaleString()} as your monthly coins and now you have total ${add.money.toLocaleString()} poro coins.`);
  }
  
  exports.help = {
    name: "Monthly",
    aliases: ["monthly"],
    usage: `monthly`,
    info: "Claim your monthly poro coins."
  }