const Discord = require("discord.js");
const cron = require('node-cron');
require('dotenv').config();
const { bumpDAO } = require('../events/ready/02_database');
const getTenorGifById = require("../utils/getTenorGifById");

let bumpReminderJob = null;

function startJob(client) {
  if (bumpReminderJob) {
    console.log('BumpReminder-Job is already running.');
    return;
  }
  bumpReminderJob = cron.schedule('* * * * *', async function () {
    try {
      const bumpEntry = await bumpDAO.getOneByGuild(process.env.GUILD_ID);
      if (bumpEntry) {
        if (bumpEntry.endTime < Date.now() && bumpEntry.reminded === 'N') {
          let guild = client.guilds.cache.get(process.env.GUILD_ID);
          let role = guild.roles.cache.find(role => role.name === 'Bump-Ping');
          await getTenorGifById("8978495178385937973")
            .then(async (gifUrl) => {
              if (!gifUrl.includes("http")) {
                console.log("ERROR Bump gif");
                return;
              }
              var bump = new Discord.EmbedBuilder()
                .setColor(0x0033cc)
                .setTitle("Es ist Zeit zu bumpen!")
                .setImage(gifUrl);
              var targetChannel = await client.channels.fetch(process.env.BUMP_ID);
              var message = await targetChannel.send({ content: `${role}`, embeds: [bump] });
              console.log('Bump reminded');
              bumpEntry.remindedId = message.id;
              bumpEntry.reminded = 'J';
              bumpDAO.update(bumpEntry);
            })
            .catch((error) => {
              console.error('ERROR:', error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  console.log('BumpReminder-Job started.');
}

function stopJob() {
  if (bumpReminderJob) {
    bumpReminderJob.stop();
    bumpReminderJob = null;
    console.log('BumpReminder-Job stopped.');
  } else {
    console.log('BumpReminder-Job is not running.');
  }
}

function isRunning() {
  return bumpReminderJob !== null;
}

module.exports = {
  startJob,
  stopJob,
  isRunning
};