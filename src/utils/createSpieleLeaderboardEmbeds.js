
const { EmbedBuilder } = require('discord.js');
const { getDaos } = require('./daos.js');
require('../sqliteModels/Bankkonten.js');

async function createSpieleLeaderboardEmbeds(page, interaction) {
    try {
        const { bankkontenDAO } = getDaos();
        const fetchedBankkonten = await bankkontenDAO.getAllByGuild(interaction.guild.id);
        if (fetchedBankkonten.length === 0) {
            console.log('ERROR: Niemand auf dem Server hat Blattläuse!');
            return new EmbedBuilder()
                .setTitle('Fehler')
                .setDescription('Es gab einen Fehler beim Erstellen des Leaderboards. Bitte versuche es später erneut.')
                .setColor(0xff0000);
        }
        var oldUsers = [];
        for (let j = 0; j < fetchedBankkonten.length; j++) {
            if (!(interaction.guild.members.cache.find(m => m.id === fetchedBankkonten[j].besitzerObj.userId)?.id)) {
                oldUsers[oldUsers.length] = j;
            }
        }
        for (let j = 0; j < oldUsers.length; j++) {
            fetchedBankkonten.splice(oldUsers[j] - j, 1);
        }
        fetchedBankkonten.sort((a, b) => {
            if (a.currentMoney === b.currentMoney) {
                return b.moneyGain - a.moneyGain;
            } else {
                return b.currentMoney - a.currentMoney;
            }
        });
        var i = 0 + (page * 5);
        var max = 5 + (page * 5);
        const embed = new EmbedBuilder()
            .setTitle(`Rangliste`)
            .setDescription(`${page + 1}/${Math.ceil(fetchedBankkonten.length / 5)}`)
            .setColor(0x0033cc);
        for (i; i < max; i++) {
            if (i === fetchedBankkonten.length) {
                break;
            }
            let userObj = await interaction.guild.members.fetch(fetchedBankkonten[i].besitzerObj.userId);
            let value;
            if (i === max - 1 || i === fetchedBankkonten.length - 1) {
                value = `Blattläuse: ${fetchedBankkonten[i].currentMoney}\n Gewinn: ${fetchedBankkonten[i].moneyGain} Verlust: ${fetchedBankkonten[i].moneyLost}`;
            } else {
                value = `Blattläuse: ${fetchedBankkonten[i].currentMoney}\n Gewinn: ${fetchedBankkonten[i].moneyGain} Verlust: ${fetchedBankkonten[i].moneyLost}\n--------------------------------------`;
            }
            embed.addFields({ name: `#${i + 1}  ${userObj.user.username}`, value: value });
        }
        return embed;
    } catch (error) {
        console.error('Error creating leaderboard embeds:', error);
        return new EmbedBuilder()
            .setTitle('Fehler')
            .setDescription('Es gab einen Fehler beim Erstellen des Leaderboards. Bitte versuche es später erneut.')
            .setColor(0xff0000);
    }
}

module.exports = createSpieleLeaderboardEmbeds;