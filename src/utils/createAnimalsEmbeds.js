const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { getDaos } = require('./daos.js');
const path = require('node:path');
require('../sqliteModels/Tiere.js');

async function createAnimalEmbeds(page, guildId, userId) {
    try {
        const { tiereDAO } = getDaos();
        const tiere = await tiereDAO.getAllByUserAndGuild(userId, guildId);
        if (!tiere || tiere.length <= 0 || !tiere[page]) {
            return undefined;
        }
        const file = new AttachmentBuilder(path.join(__dirname, `../../animals/${tiere[page].pfad}.webp`));
        const embed = new EmbedBuilder()
            .setTitle(`Deine Tiere - ${page + 1}/${tiere.length}`)
            .setDescription(`Name: ${tiere[page].customName}\nTierart: ${tiere[page].tierart}`)
            .setImage(`attachment://${tiere[page].pfad}.webp`)
            .setColor(0x0033cc)
            .setFooter({ text: `${userId}` });
        return { embed, file };
    } catch (error) {
        console.log(`Error creating leaderboard embeds: ${error.message}`);
        const embed = new EmbedBuilder()
            .setTitle('Fehler')
            .setDescription('Es gab einen Fehler beim Erstellen der Rangliste. Bitte versuche es später erneut.')
            .setColor(0xff0000);
        return { embed, undefined };
    }
}

module.exports = createAnimalEmbeds;