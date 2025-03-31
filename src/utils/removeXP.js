const Level = require('../models/Level.js');
const { EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('./calculateLevelXp.js');

const roles = new Map([[0, 'Landratte'],
[4, 'Deckschrubber'],
[9, 'Leichtmatrose'],
[14, 'Krabbenfänger'],
[19, 'Steuermann'],
[24, 'Fischfänger'],
[29, 'Haijäger'],
[34, 'Navigationsmeister'],
[39, 'Schatzsucher'],
[44, 'Tiefseetaucher'],
[49, "Meereshüter"],
[54, "Poseidons Botschafter"],
[59, "Seetag-Schnupperer"],
[64, "Backfisch Buddy"],
[69, "Panaden Profi"],
[74, "Tiefkühl Experte"],
[79, "Schollen Schmoller"],
[84, "Krabben Kommandant"],
[89, "Deck Offizier"],
[94, "Legende der Lachse"],
[99, "Ozean Operator"],
[104, "Goldene Gabel"],
[109, "Algen Architekt"],
[114, "Plankton Pionier"],
[119, "Reisender der Riffe"],
[124, "Sturmbezwinger"],
[129, "Tiefsee Titan"],
[134, "Kraken König"],
[139, "Poseidons Erbe"],
[144, "Seelenfischer"]
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
            level.removedxp += xpToRemove;
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
        return xpToRemove;
    } catch (error) {
        console.log(error);
    }
}

module.exports = removeXP;