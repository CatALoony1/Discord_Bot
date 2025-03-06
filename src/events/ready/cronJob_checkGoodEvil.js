const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');

/**
 * 
 * @param {Discord.Client} client 
 * @returns 
 */
module.exports = async (client) => {
  cron.schedule('5 0 * * *', async function () { // 7 Uhr
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    const state = await BotState.findOne({
      guildId: guild,
    });
    if (state) {
      if (state.state != 'neutral') {
        let diffTime = Math.abs(Date.now() - state.startTime);
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const oldState = state.state;
        if (diffDays >= 1) {
          state.state = 'neutral';
          state.startTime = undefined;
        }
        state.save();
        var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
        if (oldState == 'evil') {
          targetChannel.send(`Ach, ich habe mich wieder etwas beruhigt, diese Wut war echt anstrengend.`);
        } else {
          targetChannel.send(`Auch die schönste Zeit vergeht mal, schade! :(`);
        }
      }
    } else {
      console.log(`Botstate entry created`);
      const newBotstate = new BotState({
        guildId: message.guild.id,
        evilCount: 0,
        loveCount: 0,
        state: 'neutral'
      });
      await newBotstate.save();
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