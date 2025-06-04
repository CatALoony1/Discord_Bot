
const { EmbedBuilder } = require('discord.js');
const Items = require('../models/Items');

async function createLeaderboardEmbeds(page, interaction) {
    const booster = interaction.member.roles.cache.some(role => role.name === 'Server Booster') ? true : false;
    let allItems = [];
    if (booster) {
        allItems = await Items.find({});
    } else {
        allItems = await Items.find({ boostOnly: booster });
    }
    const embed = new EmbedBuilder()
        .setTitle(`Shop - ${page + 1}/${allItems.length}`)
        .setDescription(`Name: ${allItems[page].name}\nPreis: ${allItems[page].preis} Loserlinge\nBeschreibung: ${allItems[page].beschreibung}`)
        .setColor(0x0033cc);
    return embed;
}

module.exports = createLeaderboardEmbeds;