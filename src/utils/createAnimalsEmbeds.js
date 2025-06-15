const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Tiere = require('../models/Tiere');
const GameUser = require('../models/GameUser');
const path = require('node:path');

async function createLeaderboardEmbeds(page, guildId, userId) {
    const user = await GameUser.find({ guildId: guildId, userId: userId });
    if (!user) {
        return undefined;
    }
    const tiere = await Tiere.find({
        besitzer: user.id,
        besitzer: { $exists: true }
    });
    if (!tiere || tiere.length <= 0 || !tiere[page]) {
        return undefined;
    }
    const file = new AttachmentBuilder(path.join(__dirname, `../../animals/${tiere[page].pfad}.webp`));
    const embed = new EmbedBuilder()
        .setTitle(`Deine Tiere - ${page + 1}/${tiere.length}`)
        .setDescription(`Name: ${tiere[page].pfad}\nTierart: ${tiere[page].tierart}`)
        .setImage(`attachment://${tiere[page].pfad}.webp`)
        .setColor(0x0033cc)
        .setFooter({ text: `${userId}` });
    return { embed, file };
}

module.exports = createLeaderboardEmbeds;