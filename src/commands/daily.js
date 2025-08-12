const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const Lottozahlen = require('../sqliteModels/Lottozahlen');
const giveMoney = require('../utils/giveMoney');
const { lottozahlenDAO, gameUserDAO } = require('../events/ready/02_database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('daily')
        .addSubcommand(subcommand =>
            subcommand
                .setName('lotto')
                .setDescription('Tägliches Lottospiel.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bonus')
                .setDescription('Täglicher Bonus.')
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        await interaction.deferReply();
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        const subcommand = interaction.options.getSubcommand();
        const targetUserId = interaction.member.id;
        const targetUserObj = interaction.member;
        if (subcommand == 'lotto') {
            const playedToday = await lottozahlenDAO.checkUserPlayedToday(targetUserId, interaction.guild.id);
            if (playedToday) {
                interaction.editReply("Du darfst nur 1x täglich Lotto spielen!");
                return;
            }
            var lottozahl = -1;
            console.time("Lottozahlgenerierung");
            let counter = 0;
            do {
                lottozahl = Math.floor(Math.random() * 140000000);
                counter++;
            } while (await lottozahlenDAO.checkLottozahlExists(lottozahl, interaction.guild.id));
            console.timeEnd("Lottozahlgenerierung");
            console.log(`Lottozahl ${lottozahl} was generated after ${counter} tries`);
            var moneyToGive = 0;
            if (lottozahl != 0) {
                await lottozahlenDAO.insert(new Lottozahlen(undefined, interaction.guild.id, new Date(), lottozahl, targetUserId));
                var anzahlNullen = 0;
                if ((lottozahl % 10000000) === 0) {
                    moneyToGive = 2000000;
                    anzahlNullen = 7;
                } else if ((lottozahl % 1000000) === 0) {
                    moneyToGive = 750000;
                    anzahlNullen = 6;
                } else if ((lottozahl % 100000) === 0) {
                    moneyToGive = 500000;
                    anzahlNullen = 5;
                } else if ((lottozahl % 10000) === 0) {
                    moneyToGive = 250000;
                    anzahlNullen = 4;
                } else if ((lottozahl % 1000) === 0) {
                    moneyToGive = 100000;
                    anzahlNullen = 3;
                } else if ((lottozahl % 100) === 0) {
                    moneyToGive = 50000;
                    anzahlNullen = 2;
                } else if ((lottozahl % 10) === 0) {
                    moneyToGive = 5000;
                    anzahlNullen = 1;
                } else {
                    interaction.editReply(`Du hast diesmal leider nicht den Jackpot geknackt, deine Lottozahl war die ${lottozahl}`);
                    return;
                }
                if (anzahlNullen == 1) {
                    interaction.editReply(`Du hast diesmal nicht den Jackpot geknackt, aber du hast eine Zahl die mit einer Null endet und erhälst somit ${moneyToGive} Blattläuse. Deine Zahl war die ${lottozahl}`);
                } else {
                    interaction.editReply(`Du hast diesmal nicht den Jackpot geknackt, aber du hast eine Zahl die mit ${anzahlNullen} Nullen endet und erhälst somit ${moneyToGive} Blattläuse. Deine Zahl war die ${lottozahl}`);
                }
            } else {
                await lottozahlenDAO.deleteManyByGuildID(interaction.guild.id);
                interaction.editReply(`Glückwunsch <@${targetUserId}> du hast den Jackpot mit der Zahl ${lottozahl} geknackt und erhälst somit 1.000.000 XP`);
                moneyToGive = 10000000;
                let lottoRole = interaction.guild.roles.cache.find(role => role.name === 'Lottogewinner');
                await targetUserObj.roles.add(lottoRole);
                console.log(`Role Lottogewinner was given to user ${targetUserObj.user.tag}`);
            }
            await giveMoney(targetUserObj, moneyToGive);
        } else if (subcommand == 'bonus') {
            const user = await gameUserDAO.getOneByUserAndGuild(targetUserId, interaction.guild.id);
            if ((user && ((user.daily && user.daily.toDateString() !== new Date().toDateString()) || !user.daily)) || !user) {
                let bonusAmount = 1500;
                bonusAmount = await giveMoney(targetUserObj, bonusAmount, false, true);
                interaction.editReply(`Du hast deinen täglichen Bonus von ${bonusAmount} Blattläuse erhalten!`);
            } else {
                interaction.editReply("Du hast deinen täglichen Bonus bereits heute erhalten. Bitte versuche es morgen erneut.");
            }
        }
    },
    options: {
        devOnly: false,
        deleted: false
    },
};