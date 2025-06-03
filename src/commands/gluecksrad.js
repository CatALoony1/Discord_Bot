const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const removeMoney = require('../utils/removeMoney');
const giveMoney = require('../utils/giveMoney');
const Gluecksrad = require('../models/Gluecksrad');
require('dotenv').config();

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
                .setDescription('Anzahl an GELD die du setzen möchtest.')
                .setRequired(true)
                .setMaxValue(100)
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
            const einsatz = interaction.options.get('einsatz')?.value;
            const zufallsZahl = getRandomNotFloor(1, 100);
            let gluecksrad = await Gluecksrad.findOne({ guildId: interaction.guild.id });
            if (!gluecksrad) {
                gluecksrad = new Gluecksrad({
                    guildId: interaction.guild.id,
                    pool: 1000,
                });
            }
            const gewinnchance = 30 + ((gluecksrad.pool - 1000) / 500);
            const targetUserObj = interaction.member;
            await removeMoney(targetUserObj, einsatz);
            await interaction.editReply(`Dein Einsatz in Höhe von ${einsatz}GELD wurde abgezogen!`);
            var delay = 1000;
            let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
            await sleep(delay);
            const gewinnVerlust = getRandom(1, 10)/10;
            let result = Math.floor(gewinnVerlust * gluecksrad.pool * (einsatz / 100));
            if (zufallsZahl <= gewinnchance) {
                if(result == einsatz){
                    await giveMoney(targetUserObj, result, false);
                    await interaction.editReply(`Du hast deinen Einsatz von ${einsatz}GELD zurückgewonnen!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool-result}GELD`);
                } else if(result == gluecksrad.pool) {
                    await giveMoney(targetUserObj, result, false);
                    await interaction.editReply(`Du hast den Jackpot geknackt und ${result}GELD gewonnen!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool-result}GELD`);
                } else {
                    await giveMoney(targetUserObj, result, false);
                    await interaction.editReply(`Du hast ${result}GELD gewonnen!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool-result}GELD`);
                }
                result = result * -1;
            } else {
                result = Math.floor(result / 2);
                await interaction.editReply(`Du hast ${result}GELD verloren!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool+result}GELD`);
                await removeMoney(targetUserObj, result);
            }
            gluecksrad.pool = gluecksrad.pool + result;
            if (gluecksrad.pool < 1000) {
                gluecksrad.pool = 1000;
            }
            const sonderverlosung = getRandom(1, 500);
            if(sonderverlosung == 250){
                if(gluecksrad.sonderpool != 0){
                    await giveMoney(targetUserObj, gluecksrad.sonderpool, false);
                    await interaction.channel.send(`Glückwunsch ${interaction.member}! Du hast bei der Sonderverlosung gewonnen und den Sonderpool von ${gluecksrad.sonderpool}GELD erhalten!`);
                    gluecksrad.sonderpool = 0;
                }
            }
            await gluecksrad.save();
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: true,
        deleted: false,
    },
};