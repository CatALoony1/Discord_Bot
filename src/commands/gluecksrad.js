const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const removeMoney = require('../utils/removeMoney');
const giveMoney = require('../utils/giveMoney');
const Gluecksrad = require('../sqliteModels/Gluecksrad');
require('dotenv').config();
const { bankkontenDAO, gluecksradDAO } = require('../events/ready/02_database');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNotFloor(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gluecksrad')
        .setDescription('Spiele um zu gewinnen oder zu verlieren.')
        .addIntegerOption(option =>
            option.setName('einsatz')
                .setDescription('Anzahl an Blattläuse die du setzen möchtest.')
                .setRequired(true)
                .setMaxValue(10000)
                .setMinValue(1)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            if (!interaction.inGuild()) {
                interaction.reply('Hier ist doch kein Server!');
                return;
            }
            await interaction.deferReply();
            let einsatz = interaction.options.get('einsatz').value;
            const bankkonto = await bankkontenDAO.getOneByUserAndGuild(interaction.user.id, interaction.guild.id);
            if (!bankkonto || bankkonto.currentMoney < einsatz) {
                interaction.editReply(`Du hast nicht genug Blattläuse, um ${einsatz} Blattläuse zu setzen!`);
                return;
            }
            const zufallsZahl = getRandomNotFloor(1, 100);
            let gluecksrad = await gluecksradDAO.getOneByGuild(interaction.guild.id);
            if (!gluecksrad) {
                gluecksrad = new Gluecksrad(undefined, interaction.guild.id, 10000, 0);
            }
            let gewinnchance = 30 + ((gluecksrad.pool - 10000) / 5000);
            if (gewinnchance > 75) {
                gewinnchance = 75;
            }
            const targetUserObj = interaction.member;
            await removeMoney(targetUserObj, einsatz);
            await interaction.editReply(`Dein Einsatz in Höhe von ${einsatz} Blattläuse wurde abgezogen!`);
            var delay = 1000;
            let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
            await sleep(delay);
            const gewinnVerlust = getRandom(1, 10) / 10;
            let maxGewinn;
            if (einsatz >= 1000) {
                maxGewinn = 1;
            } else {
                maxGewinn = (einsatz / 1000);
            }
            let result = Math.floor(gewinnVerlust * gluecksrad.pool * maxGewinn);
            if (zufallsZahl <= gewinnchance) {
                if (result == einsatz) {
                    await giveMoney(targetUserObj, result);
                    await interaction.editReply(`Du hast deinen Einsatz von ${einsatz} Blattläuse zurückgewonnen!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool} Blattläuse`);
                } else if (result == gluecksrad.pool) {
                    await giveMoney(targetUserObj, result);
                    await interaction.editReply(`Du hast den Jackpot geknackt und ${result} Blattläuse gewonnen!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool} Blattläuse`);
                } else {
                    await giveMoney(targetUserObj, result);
                    await interaction.editReply(`Du hast ${result} Blattläuse gewonnen!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool} Blattläuse`);
                }
                result = result * -1;
            } else {
                result = Math.floor(result / 2);
                await interaction.editReply(`Du hast ${result} Blattläuse verloren!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool} Blattläuse`);
                await removeMoney(targetUserObj, result);
            }
            gluecksrad.pool = gluecksrad.pool + result;
            if (gluecksrad.pool < 10000) {
                gluecksrad.pool = 10000;
            }
            const sonderverlosung = getRandom(1, 500);
            if (sonderverlosung == 250) {
                if (gluecksrad.sonderpool != 0) {
                    await giveMoney(targetUserObj, gluecksrad.sonderpool);
                    await interaction.channel.send(`Glückwunsch ${interaction.member}! Du hast bei der Sonderverlosung gewonnen und den Sonderpool von ${gluecksrad.sonderpool} Blattläuse erhalten!`);
                    gluecksrad.sonderpool = 0;
                }
            }
            await gluecksradDAO.update(gluecksrad);
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: false,
        deleted: false,
    },
};