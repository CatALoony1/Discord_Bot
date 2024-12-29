const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');

module.exports = async (client) => {
  cron.schedule('0 7 * * *', async function () { // 7 Uhr
    var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
    targetChannel.send(`Es ist 7 Uhr, raus aus den Kajüten und alle Mann an Deck!`);
  });
}

/*
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

  * = jede

*/