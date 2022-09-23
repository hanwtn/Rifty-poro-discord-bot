exports.execute = async (client, message, args) => {
    let add = await client.eco.weekly(message.author.id, false, 2000);
    if (add.cooldown) return message.reply(`You already claimed your weekly coins. Come back after ${add.time.days} days, ${add.time.hours} hours, ${add.time.minutes} minutes & ${add.time.seconds} seconds.`);
    return message.reply(`You claimed ${add.amount} as your weekly coins and now you have total ${add.money.toLocaleString()} poro coins.`);
  }
  
  exports.help = {
    name: "Weekly",
    aliases: ["weekly"],
    usage: `weekly`,
    info: "Claim your weekly poro coins."
  }