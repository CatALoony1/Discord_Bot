
const { EmbedBuilder } = require('discord.js');
const { itemsDAO } = require('./initializeDB.js');
require('../sqliteModels/Items.js');

async function createShopEmbeds(page, interaction) {
    try {
        const booster = interaction.member.roles.cache.some(role => role.name === 'Server Booster') ? true : false;
        let allItems = await itemsDAO.getAllAvailable();
        if (allItems.length === 0) {
            console.log('ERROR: es gibt keine Items im Shop.');
            return new EmbedBuilder()
                .setTitle('Fehler')
                .setDescription('Es gab einen Fehler beim Erstellen des Shops. Bitte versuche es später erneut.')
                .setColor(0xff0000);
        }
        let price = allItems[page].preis;
        if (!booster && allItems[page].boostOnly) {
            price = price * 10;
        }
        const embed = new EmbedBuilder()
            .setTitle(`Shop - ${page + 1}/${allItems.length}`)
            .setDescription(`Name: ${allItems[page].name}\nPreis: ${price.toLocaleString('de-DE')} Blattläuse\nBeschreibung: ${allItems[page].beschreibung}`)
            .setColor(0x0033cc);
        return embed;
    } catch (error) {
        console.error('Error creating leaderboard embeds:', error);
        return new EmbedBuilder()
            .setTitle('Fehler')
            .setDescription('Es gab einen Fehler beim Erstellen des Shops. Bitte versuche es später erneut.')
            .setColor(0xff0000);
    }
}

module.exports = createShopEmbeds;