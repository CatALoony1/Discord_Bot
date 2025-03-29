const Level = require('../models/Level.js');
const { EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('./calculateLevelXp.js');

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

async function removeXP(member, xpToRemove, channel) {
    const query = {
        userId: member.user.id,
        guildId: member.guild.id,
    };
    try {
        const level = await Level.findOne(query);
        if (level) {
            console.log(`user ${member.user.tag} lost ${xpToRemove} XP`);
            level.xp -= xpToRemove;
            level.allxp -= xpToRemove;
            level.xpToRemove += xpToRemove;
            level.thismonth -= xpToRemove;
            level.lastMessage = Date.now();
            if (level.xp < 0 && level.level > 0) {
                do {
                    level.xp = level.xp + calculateLevelXp(level.level);
                    level.level -= 1;
                    console.log(`user ${member.user.tag} fell down to level ${level.level}`);
                    let description = `Oh nein ${member}! Du bist auf **Level ${level.level}** gefallen!`;
                    if (roles.has(level.level)) {
                        let newRole = roles.get(level.level);
                        description = `Oh nein ${member}!  Du bist auf **Level ${level.level}** gefallen und wurdest somit zum ${newRole} degradiert!⚓`;
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
                    }
                    const embed = new EmbedBuilder()
                        .setTitle('Mies!')
                        .setDescription(description)
                        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setColor(0x0033cc);
                    channel.send({ embeds: [embed] });
                } while (level.xp < 0 && level.level > 0);
            }
            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`);
                return;
            });
        }
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
}

module.exports = removeXP;