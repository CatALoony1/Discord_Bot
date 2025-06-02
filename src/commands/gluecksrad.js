const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const removeXP = require('../utils/removeXP');
const giveXP = require('../utils/giveXP');
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
                .setDescription('Anzahl an XP die du setzen möchtest.')
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
            if(interaction.user.id == process.env.ADMIN_ID){
                await interaction.editReply("Du hast auf magische weise und ohne schummeln den Jackpot von 1.000.000XP und den Sonderpool von 100.000XP gewonnen, wow du bist ein glückspilz!");
                return;
            }
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
            await removeXP(targetUserObj, einsatz, interaction.channel);
            await interaction.editReply(`Dein Einsatz in Höhe von ${einsatz}XP wurde abgezogen!`);
            var delay = 2000;
            let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
            await sleep(delay);
            const gewinnVerlust = getRandom(1, 10)/10;
            let result = Math.floor(gewinnVerlust * gluecksrad.pool * (einsatz / 100));
            const sonderverlosung = getRandom(1, 500);
            if(sonderverlosung == 250){
                if(gluecksrad.sonderpool != 0){
                    await giveXP(targetUserObj, gluecksrad.sonderpool, gluecksrad.sonderpool, interaction.channel, false, false, false);
                    await interaction.channel.send(`Glückwunsch ${interaction.member}! Du hast bei der Sonderverlosung gewonnen und den Sonderpool von ${gluecksrad.sonderpool}XP erhalten!`);
                    gluecksrad.sonderpool = 0;
                }
            }
            if (zufallsZahl <= gewinnchance) {
                if(result == einsatz){
                    await giveXP(targetUserObj, result, result, interaction.channel, false, false, false);
                    await interaction.editReply(`Du hast deinen Einsatz von ${einsatz}XP zurückgewonnen!`);
                } else if(result == gluecksrad.pool) {
                    await giveXP(targetUserObj, result, result, interaction.channel, false, false, false);
                    await interaction.editReply(`Du hast den Jackpot geknackt und ${result}XP gewonnen!`);
                } else {
                    await giveXP(targetUserObj, result, result, interaction.channel, false, false, false);
                    await interaction.editReply(`Du hast ${result}XP gewonnen!`);
                }
                result = result * -1;
            } else {
                result = Math.floor(result / 2);
                await interaction.editReply(`Du hast ${result}XP verloren!\n\nGewinnchance: ${gewinnchance}% | Pool: ${gluecksrad.pool}XP | Sonderzahl: ${sonderverlosung}`);
                await removeXP(targetUserObj, result, interaction.channel);
            }
            gluecksrad.pool = gluecksrad.pool + einsatz + result;
            if (gluecksrad.pool < 1000) {
                gluecksrad.pool = 1000;
            }
            await gluecksrad.save();
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: false,
    },
};