
const { EmbedBuilder } = require('discord.js');
const Items = require('../models/Items');

async function createLeaderboardEmbeds(page, interaction) {
    const booster = interaction.member.roles.cache.some(role => role.name === 'Server Booster') ? true : false;
    let allItems = await Items.find({ available: true });
    let price = allItems[page].preis;
    if (booster && !allItems[page].boostOnly) {
        price = Math.floor(price * 0.9);
    } else if (!booster && allItems[page].boostOnly) {
        price = price * 10;
    }
    const embed = new EmbedBuilder()
        .setTitle(`Shop - ${page + 1}/${allItems.length}`)
        .setDescription(`Name: ${allItems[page].name}\nPreis: ${price.toLocaleString('de-DE')} GELD\nBeschreibung: ${allItems[page].beschreibung}`)
        .setColor(0x0033cc);
    return embed;
}

module.exports = createLeaderboardEmbeds;