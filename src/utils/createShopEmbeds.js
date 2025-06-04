
const { EmbedBuilder } = require('discord.js');
const Items = require('../models/Items');

async function createLeaderboardEmbeds(page, interaction) {
    const booster = interaction.member.roles.cache.some(role => role.name === 'Server Booster') ? true : false;
    const allItems = await Items.find({boostOnly: booster});

  var i = page + 1;
  const embed = new EmbedBuilder()
    .setTitle(`Shop - ${page + 1}/${allItems.length}`)
    .setDescription(`Name:${allItems[i].name}\nPreis: ${allItems[i].price} Loserlinge\nBeschreibung: ${allItems[i].description}`)
    .setColor(0x0033cc);
  return embed;
}

module.exports = createLeaderboardEmbeds;