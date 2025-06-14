const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Tiere = require('../models/Tiere');
const GameUser = require('../models/GameUser');
const path = require('node:path');

async function createLeaderboardEmbeds(page, interaction) {
    const user = GameUser.find({ guildId: interaction.guild.id, userId: interaction.user.id });
    if (!user) {
        return undefined;
    }
    const tiere = await Tiere.find({ besitzer: user._id });
console.log(tiere);
console.log(tiere.length);
console.log(tiere[page]);
    if (!tiere || tiere.length <= 0 || !tiere[page]) {
        return undefined;
    }
    const file = new AttachmentBuilder(path.join(__dirname, `../../animals/${tiere[page].pfad}.webp`));
    const embed = new EmbedBuilder()
        .setTitle(`Deine Tiere - ${page + 1}/${tiere.length}`)
        .setDescription(`Name: ${tiere[page].pfad}\nTierart: ${tiere[page].tierart}`)
        .setImage(`attachment://${tiere[page].pfad}.webp`)
        .setColor(0x0033cc);
    return { embed, file };
}

module.exports = createLeaderboardEmbeds;