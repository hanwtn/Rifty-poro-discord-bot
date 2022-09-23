
module.exports = (client) => {

  console.log(`${client.user.tag} is online!`);

  const jobsArray = ['https://riftyporo.vercel.app, WATCHING', 'r!help, WATCHING', 'Wild Rift, PLAYING', `with poro, PLAYING`, `with poro, PLAYING`, `killing Baron Nashor, PLAYING`];

  setInterval(() => {

    const random = jobsArray[Math.floor(Math.random() * jobsArray.length)].split(', ')
    const jobs = random[0];
    const mode = random[1];
    client.user.setPresence({
      status: 'idle',
      activities: [{
        name: jobs,
        type: mode
      }]
    });

  }, 30000)

};