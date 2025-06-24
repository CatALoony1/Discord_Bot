require('dotenv').config();
const cron = require('node-cron');

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let goodMorningJob = null;

function startJob(client) {
  if (goodMorningJob) {
    console.log('GoodMorning-Job is already running.');
    return;
  }
  var verschlafen = cron.schedule('0 10 * * *', async function () { // 10 Uhr
    var targetChannel = await client.channels.fetch(process.env.ALLGEMEIN_ID);
    targetChannel.send(`AUFSTEHEN! Warum habt ihr Versager mich denn nicht früher geweckt?`);
    verschlafen.stop();
  });
  verschlafen.stop();
  goodMorningJob = cron.schedule('0 7 * * *', async function () { // 7 Uhr
    if (getRandom(1, 25) != 1) {
      var targetChannel = await client.channels.fetch(process.env.ALLGEMEIN_ID);
      targetChannel.send(`Es ist 7 Uhr, alle aus den Betten und lasset das Versagen beginnen!`);
    } else {
      verschlafen.start();
    }
  });
  console.log('GoodMorning-Job started.');
}

function stopJob() {
  if (goodMorningJob) {
    goodMorningJob.stop();
    goodMorningJob = null;
    console.log('GoodMorning-Job stopped.');
  } else {
    console.log('GoodMorning-Job is not running.');
  }
}

function isRunning() {
  return goodMorningJob !== null;
}

module.exports = {
  startJob,
  stopJob,
  isRunning
};

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