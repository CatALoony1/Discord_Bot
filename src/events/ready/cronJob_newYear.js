require('dotenv').config();
const cron = require('node-cron');

module.exports = async (client) => {
  cron.schedule('0 0 1 1 *', async function () {
    var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
    targetChannel.send(`Der Captain wünscht euch ein schönes und erfolgreiches neues Jahr!`);
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