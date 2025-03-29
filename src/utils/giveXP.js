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
[40, 'Tiefseetaucher']
]);

async function giveXP(member, xpToGive, bonusXP, channel, message, voice, quizadded) {
    const query = {
        userId: member.user.id,
        guildId: member.guild.id,
    };
    try {
        const level = await Level.findOne(query);
        if (level) {
            if (member.roles.cache.some(role => role.name === 'Bumper')) {
                xpToGive = Math.ceil(xpToGive * 1.1);
            }
            console.log(`user ${member.user.tag} received ${xpToGive} XP`);
            level.xp += xpToGive;
            level.allxp += xpToGive;
            if (message) {
                level.messagexp += (xpToGive - bonusXP);
                level.messages += 1;
            } else if (voice) {
                level.voicexp += xpToGive;
                level.voicetime += 5;
            }
            if (quizadded) {
                level.quizadded += 1;
            }
            level.thismonth += xpToGive;
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
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
}

module.exports = giveXP;