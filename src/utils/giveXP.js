const Level = require('../models/Level.js');
const { EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('../utils/calculateLevelXp.js');

const roles = new Map([[0, 'Landratte'],
[1, 'Deckschrubber'],
[5, 'Leichtmatrose'],
[10, 'Krabbenfänger'],
[15, 'Steuermann'],
[20, 'Fischfänger'],
[25, 'Haijäger'],
[30, 'Navigationsmeister'],
[35, 'Schatzsucher'],
[40, 'Tiefseetaucher'],
[45, "Meereshüter"],
[50, "Poseidons Botschafter"],
[55, "Seetag-Schnupperer"],
[60, "Backfisch Buddy"],
[65, "Panaden Profi"],
[70, "Tiefkühl Experte"],
[75, "Schollen Schmoller"],
[80, "Krabben Kommandant"],
[85, "Deck Offizier"],
[90, "Legende der Lachse"],
[95, "Ozean Operator"],
[100, "Goldene Gabel"],
[105, "Algen Architekt"],
[110, "Plankton Pionier"],
[115, "Reisender der Riffe"],
[120, "Sturmbezwinger"],
[125, "Tiefsee Titan"],
[130, "Kraken König"],
[135, "Poseidons Erbe"],
[140, "Seelenfischer"]
]);

async function giveXP(member, xpToGive, bonusXP, channel, message, voice, quizadded) {
    const query = {
        userId: member.user.id,
        guildId: member.guild.id,
    };
    try {
        const level = await Level.findOne(query);
        if (level) {
            let xpAmount = xpToGive;
            if (quizadded) {
                if (level.quizadded > 0 && level.quizadded <= 10) {
                    xpAmount = (xpAmount + (level.quizadded * 10));
                } else if (level.quizadded > 10 && level.quizadded <= 30) {
                    xpAmount = (xpAmount + (level.quizadded * 5));
                } else if (level.quizadded > 30 && level.quizadded <= 100) {
                    xpAmount = (xpAmount + (level.quizadded * 2));
                } else if (level.quizadded > 100) {
                    xpAmount = (xpAmount + level.quizadded);
                }
            }
            if (member.roles.cache.some(role => role.name === 'Bumper')) {
                xpAmount = Math.ceil(xpAmount * 1.1);
            }
            if (message) {
                level.messagexp += (xpAmount - bonusXP);
                level.messages += 1;
            } else if (voice) {
                level.voicexp += xpAmount;
                level.voicetime += 5;
            } else if (quizadded) {
                level.quizadded += 1;
            }
            console.log(`user ${member.user.tag} received ${xpToGive} XP`);
            level.xp += xpAmount;
            level.allxp += xpAmount;
            level.thismonth += xpAmount;
            level.bonusclaimed += bonusXP;
            level.lastMessage = Date.now();
            if (level.xp >= calculateLevelXp(level.level)) {
                do {
                    level.xp = level.xp - calculateLevelXp(level.level);
                    level.level += 1;
                    console.log(`user ${member.user.tag} reached level ${level.level}`);
                    let description = `🎉 Glückwunsch ${member}! Du hast **Level ${level.level}** erreicht!⚓`;

                    if (roles.has(level.level)) {
                        let newRole = roles.get(level.level);
                        description = `🎉 Glückwunsch ${member}! Du hast **Level ${level.level}** erreicht und bist somit zum ${newRole} aufgestiegen!⚓`;

                        for (const value of roles.values()) {
                            if (member.roles.cache.some(role => role.name === value)) {
                                let tempRole = member.guild.roles.cache.find(role => role.name === value);
                                await member.guild.members.cache.get(member.user.id).roles.remove(tempRole);
                                console.log(`Role ${value} was removed from user ${member.user.tag}`);
                            }
                        }
                        let role = member.guild.roles.cache.find(role => role.name === newRole);
                        await member.guild.members.cache.get(member.user.id).roles.add(role);
                        console.log(`Role ${newRole} was given to user ${member.user.tag}`);
                        if (level.level === 1) {
                            let memberRole = member.guild.roles.cache.find(role => role.name === 'Mitglied');
                            await member.guild.members.cache.get(member.user.id).roles.add(memberRole);
                            console.log(`Role Mitglied was given to user ${member.user.tag}`);
                        }
                    }
                    const embed = new EmbedBuilder()
                        .setTitle('Glückwunsch!')
                        .setDescription(description)
                        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setColor(0x0033cc);
                    channel.send({ embeds: [embed] });
                } while (level.xp >= calculateLevelXp(level.level));
            }
            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`);
                return;
            });
        } else {
            console.log(`user ${member.user.tag} received ${xpToGive} XP`);
            console.log(`new user ${member.user.tag} added to database`);
            const newLevel = new Level({
                userId: member.user.id,
                guildId: member.guild.id,
                xp: xpToGive,
                allxp: xpToGive,
                messages: 0,
                lastMessage: Date.now(),
                userName: member.user.tag,
                messagexp: 0,
                voicexp: 0,
                voicetime: 0,
                thismonth: xpToGive,
                bonusclaimed: bonusXP,
                quizadded: 0
            });
            if (message) {
                newLevel.messagexp += (xpToGive - bonusXP);
                newLevel.messages += 1;
            } else if (voice) {
                newLevel.voicexp += xpToGive;
                newLevel.voicetime += 5;
            }
            if (quizadded) {
                newLevel.quizadded += 1;
            }
            await newLevel.save();
        }
        return xpToGive;
    } catch (error) {
        console.log(error);
    }
}

module.exports = giveXP;