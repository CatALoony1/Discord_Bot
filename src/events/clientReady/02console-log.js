require('dotenv').config();
const getGifById = require('../../utils/getGifById');
const { EmbedBuilder } = require('discord.js');
module.exports = {
  once: true,

  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
      let targetUser = undefined;
      const guilds = await client.guilds.cache;
      let message = `Bot ist gestartet.\nDer Bot ist laut API auf ${guilds.size} Server(n):\n`;
      await guilds.forEach(async (guild) => {
        if (!targetUser) {
          targetUser = await guild.members.fetch(process.env.ADMIN_ID);
        }
        message = `${message}- ${guild.name} (ID: ${guild.id})`;
      });
      if (targetUser) {
        targetUser.send(message);
        const gifUrl = await getGifById('igry3SpqajLhzyYMO5');
        if (!gifUrl.includes('http')) {
          console.log('ERROR Welcome gif');
          return;
        }
        const welcome = new EmbedBuilder()
          .setColor(0x0033cc)
          .setTitle(`Titel`)
          .setDescription(`Beschreibung`)
          .setImage(gifUrl);
        await targetUser.send({
          embeds: [welcome],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
