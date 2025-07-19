
const { EmbedBuilder } = require('discord.js');
const GameUser = require('../models/GameUser.js');
require('../models/Bankkonten.js');

async function createSpieleLeaderboardEmbeds(page, interaction) {
    const fetchedGameUsers = await GameUser.find({
        guildId: interaction.guild.id,
    }).populate('bankkonto');

    if (fetchedGameUsers.length === 0) {
        console.log('ERROR: Niemand auf dem Server hat Level');
        return;
    }
    var oldUsers = [];
    for (let j = 0; j < fetchedGameUsers.length; j++) {
        if (!(interaction.guild.members.cache.find(m => m.id === fetchedGameUsers[j].userId)?.id)) {
            oldUsers[oldUsers.length] = j;
        }
    }
    for (let j = 0; j < oldUsers.length; j++) {
        fetchedGameUsers.splice(oldUsers[j] - j, 1);
    }
    fetchedGameUsers.sort((a, b) => {
        if (a.bankkonto.currentMoney === b.bankkonto.currentMoney) {
            return b.bankkonto.moneyGain - a.bankkonto.moneyGain;
        } else {
            return b.bankkonto.currentMoney - a.bankkonto.currentMoney;
        }
    });
    var i = 0 + (page * 5);
    var max = 5 + (page * 5);
    const embed = new EmbedBuilder()
        .setTitle(`Rangliste`)
        .setDescription(`${page + 1}/${Math.ceil(fetchedGameUsers.length / 5)}`)
        .setColor(0x0033cc);
    for (i; i < max; i++) {
        if (i === fetchedGameUsers.length) {
            break;
        }
        let userObj = await interaction.guild.members.fetch(fetchedGameUsers[i].userId);
        let value;
        if (i === max - 1 || i === fetchedLevel.length - 1) {
            value = `Blattläuse: ${fetchedGameUsers[i].bankkonto.currentMoney}\n Gewinn: ${fetchedGameUsers[i].bankkonto.moneyGain} Verlust: ${fetchedGameUsers[i].bankkonto.moneyLost}`;
        } else {
            value = `Blattläuse: ${fetchedGameUsers[i].bankkonto.currentMoney}\n Gewinn: ${fetchedGameUsers[i].bankkonto.moneyGain} Verlust: ${fetchedGameUsers[i].bankkonto.moneyLost}\n--------------------------------------`;
        }
        embed.addFields({ name: `#${i + 1}  ${userObj.user.username}`, value: value });
    }
    return embed;
}

module.exports = createSpieleLeaderboardEmbeds;