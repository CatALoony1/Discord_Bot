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
            const einsatz = interaction.options.get('einsatz')?.value;
            const zufallsZahl = getRandom(1, 100);
            let gluecksrad = await Gluecksrad.findOne({ guildId: interaction.guild.id });
            if (!gluecksrad) {
                gluecksrad = new Gluecksrad({
                    guildId: interaction.guild.id,
                    pool: 1000,
                });
            }
            const gewinnchance = 33 + ((gluecksrad.pool - 1000) / 500);
            const targetUserObj = interaction.member;
            await removeXP(targetUserObj, einsatz, interaction.channel);
            await interaction.editReply(`Dein Einsatz in Höhe von ${einsatz}XP wurde abgezogen!`);
            var delay = 2000;
            let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
            await sleep(delay);
            const gewinnVerlust = getRandom(1, 10)/10;
            let result = Math.floor(gewinnVerlust * gluecksrad.pool * (einsatz / 100));
            if (zufallsZahl >= gewinnchance) {
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
                result = result / 2;
                await interaction.editReply(`Du hast ${result}XP verloren!`);
                await removeXP(targetUserObj, result, interaction.channel);
                result = result;
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