const Discord = require("discord.js");
const cron = require('node-cron');
const Level = require('../../models/Level');

module.exports = async (client) => {
  cron.schedule('0 0 1 * *', async function () {
    console.log('Started deleting monthly XP');
    try {
      const fetchedLevel = await Level.find({
        guildId: interaction.guild.id,
      });
      fetchedLevel.forEach(async level => {
        level.lastmonth = level.thismonth;
        level.thismonth = 0;
        await level.save()
      });
    } catch (error) {
      console.log(`Error deleting monthly xp: ${error}`);
    }
    console.log('Finished deleting monthly XP');
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