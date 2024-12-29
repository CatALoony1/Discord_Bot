const Discord = require("discord.js");
require('dotenv').config();
const Bump = require('../../models/Bump');

module.exports = async (client) => {
  setInterval(async () => {
    const query = {
      guildId: process.env.GUILD_ID,
    };
    try {
      const bumpEntry = await Bump.findOne(query);
      if (bumpEntry) {
        if (bumpEntry.endTime < Date.now() && bumpEntry.reminded === 'N') {
          bumpReady(client);
          console.log('Bump reminded');
          bumpEntry.reminded = 'J';
          bumpEntry.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, 5000);
};

async function bumpReady(client) {
  let guild = client.guilds.cache.get(process.env.GUILD_ID);
  let role = guild.roles.cache.find(role => role.name === 'Bump-Ping');
  var bump = new Discord.EmbedBuilder()
    .setColor(0x0033cc)
    .setTitle("Es ist Zeit zu bumpen!")
    .setImage('https://media1.tenor.com/m/fJoFy21AVjUAAAAd/bump.gif');
  var targetChannel = await client.channels.fetch(process.env.BUMP_ID);
  var message = await targetChannel.send(`||${role}||`);
  await message.reply({ embeds: [bump] });
  message.delete();
}