const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client) => {
  var verschlafen = cron.schedule('0 10 * * *', async function () { // 10 Uhr
    var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
    targetChannel.send(`„Alle Mann an Deck! … Moment mal, warum ist es schon so hell?“`);
    verschlafen.stop();
  });
  cron.schedule('0 7 * * *', async function () { // 7 Uhr
    if (getRandom(1, 25) != 1) {
      var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
      targetChannel.send(`Es ist 7 Uhr, raus aus den Kajüten und alle Mann an Deck!`);
    } else {
      verschlafen.start();
    }
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