require('dotenv').config();
const cron = require('node-cron');

let newYearJob = null;

function startNewYearJob(client) {
  if (newYearJob) {
    console.log('NewYear-Job is already running.');
    return;
  }
  newYearJob = cron.schedule('0 0 1 1 *', async function () {
    var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
    targetChannel.send(`Der Captain wünscht euch ein schönes und erfolgreiches neues Jahr!`);
  });
  console.log('NewYear-Job started.');
}

function stopNewYearJob() {
  if (newYearJob) {
    newYearJob.stop();
    newYearJob = null;
    console.log('NewYear-Job stopped.');
  } else {
    console.log('NewYear-Job is not running.');
  }
}

function isNewYearJobRunning() {
  return newYearJob !== null;
}

module.exports = {
  startNewYearJob,
  stopNewYearJob,
  isNewYearJobRunning
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