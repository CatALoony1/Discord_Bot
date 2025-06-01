const Level = require('../models/Level.js');
const Gluecksrad = require('../models/Gluecksrad.js');
const { EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('../utils/calculateLevelXp.js');
require('dotenv').config();

const roles = new Map([[0, '1312394062258507869'],
[1, '1310211770694111294'],
[5, '1310213081950982175'],
[10, '1310213489134141440'],
[15, '1310214010527944754'],
[20, '1310214475890294834'],
[25, '1310214766890975242'],
[30, '1310215332488810607'],
[35, '1310215659921346641'],
[40, '1310216071168528476'],
[45, '1310216856228991026'],
[50, '1310217257057517710'],
[55, '1354905284061171934'],
[60, '1354906395421573270'],
[65, '1354906488023421149'],
[70, '1354906720677396572'],
[75, '1354906879188406333'],
[80, '1354906953192575027'],
[85, '1354907134365794324'],
[90, '1354907338846502922'],
[95, '1354907582220730380'],
[100, '1354907776480051460'],
[105, '1354907929140006943'],
[110, '1354908045095866429'],
[115, '1354908138364735739'],
[120, '1354908258954907909'],
[125, '1354908324793028768'],
[130, '1354908358422958181'],
[135, '1354908587344003252'],
[140, '1354908712170426507']
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
            console.log(`user ${member.user.tag} received ${xpAmount} XP`);
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
                    let description = `🎉 Glückwunsch ${member}! Du hast **Level ${level.level}** erreicht!`;

                    if (roles.has(level.level)) {
                        let newRole = roles.get(level.level);
                        for (const value of roles.values()) {
                            if (member.roles.cache.has(value)) {
                                let tempRole = member.guild.roles.cache.get(value);
                                await member.guild.members.cache.get(member.user.id).roles.remove(tempRole);
                                console.log(`Role ${value} was removed from user ${member.user.tag}`);
                            }
                        }
                        let role = member.guild.roles.cache.get(newRole);
                        await member.guild.members.cache.get(member.user.id).roles.add(role);
                        description = `🎉 Glückwunsch ${member}! Du hast **Level ${level.level}** erreicht und bist somit zum ${role.name} aufgestiegen!`;
                        console.log(`Role ${role.name} was given to user ${member.user.tag}`);
                        if (level.level === 1) {
                            let memberRole = member.guild.roles.cache.get(process.env.MITGLIED_ROLE_ID);
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
        const gluecksrad = await Gluecksrad.findOne({ guildId: member.guild.id });
        if (gluecksrad) {
            gluecksrad.sonderpool += xpToGive;
            await gluecksrad.save();
        } else {
            const newGluecksrad = new Gluecksrad({
                guildId: member.guild.id,
                pool: 1000,
                sonderpool: xpToGive
            });
            await newGluecksrad.save();
        }
        return xpToGive;
    } catch (error) {
        console.log(error);
    }
}

module.exports = giveXP;