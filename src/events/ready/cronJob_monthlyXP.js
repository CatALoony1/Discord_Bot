const cron = require('node-cron');
const Level = require('../../models/Level');
require('dotenv').config();

module.exports = async () => {
  cron.schedule('0 0 1 * *', async function () {
    console.log('Started deleting monthly XP');
    try {
      const fetchedLevel = await Level.find({
        guildId: process.env.GUILD_ID,
      });
      fetchedLevel.forEach(async level => {
        level.lastmonth = level.thismonth;
        level.thismonth = 0;
        await level.save();
      });
    } catch (error) {
      console.log(error);
    }
    console.log('Finished deleting monthly XP');
  });
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