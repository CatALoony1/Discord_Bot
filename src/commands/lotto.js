const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const Lottozahlen = require('../models/Lottozahlen');
const Level = require('../models/Level');
const calculateLevelXp = require('../utils/calculateLevelXp');

const roles = new Map([[0, 'Landratte'],
[1, 'Deckschrubber'],
[5, 'Leichtmatrose'],
[10, 'Krabbenfänger'],
[15, 'Steuermann'],
[20, 'Fischfänger'],
[25, 'Haijäger'],
[30, 'Navigationsmeister'],
[35, 'Schatzsucher'],
[40, 'Tiefseetaucher']
]);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lotto')
        .setDescription('Spiele 1x täglich Lotto.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        await interaction.deferReply();
        const targetUserId = interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });
        if (!fetchedLevel) {
            interaction.editReply("Du musst mindestens 1 Nachricht auf dem Server geschrieben haben um Lotto spielen zu dürfen!");
            return;
        }
        const latestLotto = await Lottozahlen.findOne({ guildId: interaction.guild.id, userId: targetUserId })
            .sort({ drawnTime: -1 });
        if (latestLotto) {
            const drawnTime = latestLotto.drawnTime;
            const heute = new Date();
            heute.setHours(0, 0, 0, 0);

            const drawnTimeDatum = new Date(drawnTime);
            drawnTimeDatum.setHours(0, 0, 0, 0);
            if (drawnTimeDatum.getTime() >= heute.getTime()) {
                interaction.editReply("Du darfst nur 1x täglich Lotto spielen!");
                return;
            }
        }
        const allLotto = await Lottozahlen.find({ guildId: interaction.guild.id });
        var lottozahl = -1;
        if (allLotto && allLotto.length > 0) {
            const lottozahlenArray = allLotto.map(dokument => dokument.lottozahl);
            do {
                lottozahl = Math.floor(Math.random() * 140000000);
            } while (lottozahlenArray.includes(lottozahl));
        } else {
            lottozahl = Math.floor(Math.random() * 140000000);
        }
        var xpToGive = 0;
        if (lottozahl != 0) {
            const newLottozahl = new Lottozahlen({
                guildId: interaction.guild.id,
                userId: targetUserId,
                drawnTime: new Date(),
                lottozahl: lottozahl,
            });
            await newLottozahl.save();
            var anzahlNullen = 0;
            if ((lottozahl % 10000000) === 0) {
                xpToGive = 100000;
                anzahlNullen = 7;
            } else if ((lottozahl % 1000000) === 0) {
                xpToGive = 50000;
                anzahlNullen = 6;
            } else if ((lottozahl % 100000) === 0) {
                xpToGive = 25000;
                anzahlNullen = 5;
            } else if ((lottozahl % 10000) === 0) {
                xpToGive = 10000;
                anzahlNullen = 4;
            } else if ((lottozahl % 1000) === 0) {
                xpToGive = 5000;
                anzahlNullen = 3;
            } else if ((lottozahl % 100) === 0) {
                xpToGive = 1000;
                anzahlNullen = 2;
            } else if ((lottozahl % 10) === 0) {
                xpToGive = 100;
                anzahlNullen = 1;
            } else {
                interaction.editReply(`Du hast diesmal leider nicht den Jackpot geknackt, deine Lottozahl war die ${lottozahl}`);
                return;
            }
            if (anzahlNullen == 1) {
                interaction.editReply(`Du hast diesmal nicht den Jackpot geknackt, aber du hast eine Zahl die mit einer Null endet und erhälst somit ${xpToGive}XP. Deine Zahl war die ${lottozahl}`);
            } else {
                interaction.editReply(`Du hast diesmal nicht den Jackpot geknackt, aber du hast eine Zahl die mit ${anzahlNullen} Nullen endet und erhälst somit ${xpToGive}XP. Deine Zahl war die ${lottozahl}`);
            }
        } else {
            await Lottozahlen.deleteMany({ guildId: interaction.guild.id });
            interaction.editReply(`Glückwunsch <@${targetUserId}> du hast den Jackpot mit der Zahl ${lottozahl} geknackt und erhälst somit 1.000.000 XP`);
            xpToGive = 1000000;
            let lottoRole = interaction.guild.roles.cache.find(role => role.name === 'Lottogewinner');
            await targetUserObj.roles.add(lottoRole);
            console.log(`Role Lottogewinner was given to user ${targetUserObj.user.tag}`);
        }
        if (xpToGive != 0) {
            console.log(`user ${targetUserObj.user.tag} received ${xpToGive} XP`);
            level.xp += xpToGive;
            level.allxp += xpToGive;
            level.messagexp += (xpToGive - bonusXP);
            level.thismonth += xpToGive;
            level.bonusclaimed += bonusXP;
            level.messages += 1;
            level.lastMessage = Date.now();
            if (level.xp >= calculateLevelXp(level.level)) {
                do {
                    level.xp = level.xp - calculateLevelXp(level.level);
                    level.level += 1;
                    console.log(`user ${targetUserObj.user.tag} reached level ${level.level}`);
                    let description = `🎉 Glückwunsch ${targetUserObj}! Du hast **Level ${level.level}** erreicht!⚓`;
                    if (roles.has(level.level)) {
                        let newRole = roles.get(level.level);
                        description = `🎉 Glückwunsch ${targetUserObj}! Du hast **Level ${level.level}** erreicht und bist somit zum ${newRole} aufgestiegen!⚓`;

                        for (const value of roles.values()) {
                            if (targetUserObj.roles.cache.some(role => role.name === value)) {
                                let tempRole = interaction.guild.roles.cache.find(role => role.name === value);
                                await targetUserObj.roles.remove(tempRole);
                                console.log(`Role ${value} was removed from user ${targetUserObj.user.tag}`);
                            }
                        }
                        let role = interaction.guild.roles.cache.find(role => role.name === newRole);
                        await targetUserObj.roles.add(role);
                        console.log(`Role ${newRole} was given to user ${targetUserObj.user.tag}`);
                        if (level.level === 1) {
                            let memberRole = interaction.guild.roles.cache.find(role => role.name === 'Mitglied');
                            await targetUserObj.roles.add(memberRole);
                            console.log(`Role Mitglied was given to user ${targetUserObj.user.tag}`);
                        }
                    }
                    const embed = new EmbedBuilder()
                        .setTitle('Glückwunsch!')
                        .setDescription(description)
                        .setThumbnail(targetUserObj.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setColor(0x0033cc);
                    interaction.channel.send({ embeds: [embed] });
                } while (level.xp >= calculateLevelXp(level.level));
            }
            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`);
                return;
            });
        }
    },
};