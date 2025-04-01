const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const removeXP = require('../utils/removeXP');
const giveXP = require('../utils/giveXP');
require('dotenv').config();

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function istGerade(zahl) {
    return zahl % 2 === 0;
}

const gewinne = new Map([[1, 2],
[3, 3],
[5, 3.5],
[7, 4],
[9, 1],//erhält Einsatz zurück
[11, 0],//verliert lediglich Einsatz
[13, 8.5],
[15, 11],
[17, 21],
[19, 0.5],//erhält halben Einsatz zurück
[2, 1.5],
[4, 2],
[6, 2.5],
[8, 3],
[10, 3.5],
[12, 4],
[14, 4.5],
[16, 5],
[18, 6],
[20, 9],
]);

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
            const targetUserId = interaction.member.id;
            const zufallsZahl = getRandom(1, gewinne.size);
            const targetUserObj = await interaction.guild.members.fetch(targetUserId);
            let result = Math.ceil(einsatz * gewinne.get(zufallsZahl));
            await removeXP(targetUserObj, einsatz, interaction.channel);
            await interaction.editReply(`Dein Einsatz in Höhe von ${einsatz}XP wurde abgezogen!`);
            var delay = 2000;
            let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
            await sleep(delay);
            if (istGerade(zufallsZahl) || zufallsZahl == 1) {
                result = await removeXP(targetUserObj, result, interaction.channel);
                await interaction.editReply(`Du hast ${result}XP verloren! Mit deinem Einsatz eingerechnet sind das ${einsatz + result}XP Verlust!`);
            } else if (zufallsZahl == 9) {
                result = await giveXP(targetUserObj, result, result, interaction.channel, false, false, false);
                await interaction.editReply(`Du erhälst deinen Einsatz zurück! Versuche es doch einfach erneut`);
            } else if (zufallsZahl == 11) {
                await interaction.editReply(`Du hast lediglich deinen Einsatz in Höhe von ${einsatz}XP verloren!`);
            } else {
                result = await giveXP(targetUserObj, result, result, interaction.channel, false, false, false);
                if ((result - einsatz) < 0) {
                    await interaction.editReply(`Glückwunsch, du hast ${result}XP gewonnen! Nach Abzug deines Einsatzes hast du somit trotzdem einen Verlust von ${Math.abs(result - einsatz)}XP!`);
                } else {
                    await interaction.editReply(`Glückwunsch, du hast ${result}XP gewonnen! Nach Abzug deines Einsatzes hast du somit einen Gewinn von ${result - einsatz}XP!`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: false,
    },
};