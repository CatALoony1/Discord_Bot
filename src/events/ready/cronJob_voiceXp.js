const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');
const Config = require('../../models/Config');
const calculateLevelXp = require('../../utils/calculateLevelXp');

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

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client) => {
    cron.schedule('*/5 * * * *', async function () {
        console.log(`VoiceXP-Job started...`);
        var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
        let confQuery = {
            key: "xpMultiplier"
        }
        let conf = await Config.findOne(confQuery);
        let multiplier = 1;
        if (conf) {
            multiplier = Number(conf.value);
        }
        let xpToGive = 5 * getRandomXp(1, 5) * multiplier;
        await client.channels.cache.forEach(async (channel) => {
            if (channel.type == 2 && channel.id != '1307820687599337602') {
                if (channel.members.size >= 2) {
                    channel.members.forEach(async (member) => {
                        const query = {
                            userId: member.user.id,
                            guildId: channel.guild.id,
                        };
                        try {
                            const level = await Level.findOne(query);
                            console.log(`user ${member.user.tag} received ${xpToGive} XP (Voice)`);
                            if (level) {
                                level.xp += xpToGive;
                                level.allxp += xpToGive;
                                level.voicexp += xpToGive;
                                level.thismonth += xpToGive;
                                level.lastMessage = Date.now();
                                level.voicetime += 5;
                                if (level.xp >= calculateLevelXp(level.level)) {
                                    level.xp = level.xp - calculateLevelXp(level.level);
                                    level.level += 1;
                                    console.log(`user ${member.user.tag} reached level ${level.level}`);
                                    let description = `🎉 Glückwunsch ${member}! Du hast **Level ${level.level}** erreicht!⚓`;
                                    if (roles.has(level.level)) {
                                        let newRole = roles.get(level.level);
                                        description = `🎉 Glückwunsch ${member}! Du hast **Level ${level.level}** erreicht und bist somit zum ${newRole} aufgestiegen!⚓`;
                                        for (const value of roles.values()) {
                                            if (member.roles.cache.some(role => role.name === value)) {
                                                let tempRole = channel.guild.roles.cache.find(role => role.name === value);
                                                await channel.guild.members.cache.get(member.id).roles.remove(tempRole);
                                                console.log(`Role ${value} was removed from user ${member.user.tag}`);
                                            }
                                        }
                                        let role = channel.guild.roles.cache.find(role => role.name === newRole);
                                        await channel.guild.members.cache.get(member.id).roles.add(role);
                                        console.log(`Role ${newRole} was given to user ${member.user.tag}`);
                                        if (level.level === 1) {
                                            let memberRole = channel.guild.roles.cache.find(role => role.name === 'Mitglied');
                                            await channel.guild.members.cache.get(member.id).roles.add(memberRole);
                                            console.log(`Role Mitglied was given to user ${member.user.tag}`);
                                        }
                                    }
                                    const embed = new Discord.EmbedBuilder()
                                        .setTitle('Glückwunsch!')
                                        .setDescription(description)
                                        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                        .setColor(0x0033cc);
                                    targetChannel.send({ embeds: [embed] });
                                }
                                await level.save().catch((e) => {
                                    console.log(`Error saving updated level (voice) ${e}`);
                                    return;
                                });
                            } else {
                                console.log(`new user ${member.user.tag} added to database`);
                                const newLevel = new Level({
                                    userId: member.user.id,
                                    guildId: channel.guild.id,
                                    xp: xpToGive,
                                    allxp: xpToGive,
                                    messages: 0,
                                    lastMessage: Date.now(),
                                    userName: member.user.tag,
                                    messagexp: 0,
                                    voicexp: xpToGive,
                                    voicetime: 5,
                                    thismonth: xpToGive,
                                    bonusclaimed: 0,
                                    quizadded: 1
                                });
                                await newLevel.save();
                            }
                        } catch (error) {
                            console.log(`Error giving voice-xp: ${error}`);
                        }
                    });
                }
            }
        });
        console.log(`VoiceXP-Job finished`);
    });
}
