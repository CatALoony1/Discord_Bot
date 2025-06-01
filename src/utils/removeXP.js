const Level = require('../models/Level.js');
const Gluecksrad = require('../models/Gluecksrad.js');
const { EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('./calculateLevelXp.js');

const roles = new Map([[0, '1312394062258507869'],
[4, '1310211770694111294'],
[9, '1310213081950982175'],
[14, '1310213489134141440'],
[19, '1310214010527944754'],
[24, '1310214475890294834'],
[29, '1310214766890975242'],
[34, '1310215332488810607'],
[39, '1310215659921346641'],
[44, '1310216071168528476'],
[49, '1310216856228991026'],
[54, '1310217257057517710'],
[59, '1354905284061171934'],
[64, '1354906395421573270'],
[69, '1354906488023421149'],
[74, '1354906720677396572'],
[79, '1354906879188406333'],
[84, '1354906953192575027'],
[89, '1354907134365794324'],
[94, '1354907338846502922'],
[99, '1354907582220730380'],
[104, '1354907776480051460'],
[109, '1354907929140006943'],
[114, '1354908045095866429'],
[119, '1354908138364735739'],
[124, '1354908258954907909'],
[129, '1354908324793028768'],
[134, '1354908358422958181'],
[139, '1354908587344003252'],
[144, '1354908712170426507']
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
                    level.level -= 1;
                    level.xp = level.xp + calculateLevelXp(level.level);
                    console.log(`user ${member.user.tag} fell down to level ${level.level}`);
                    let description = `Oh nein ${member}! Du bist auf **Level ${level.level}** gefallen!`;
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
                        description = `Oh nein ${member}!  Du bist auf **Level ${level.level}** gefallen und wurdest somit zum ${role.name} degradiert!`;
                        await member.guild.members.cache.get(member.user.id).roles.add(role);
                        console.log(`Role ${role.name} was given to user ${member.user.tag}`);
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
        const gluecksrad = await Gluecksrad.findOne({ guildId: member.guild.id });
        if (gluecksrad) {
            gluecksrad.sonderpool += Math.floor(xpToRemove / 2);
            await gluecksrad.save();
        } else {
            const newGluecksrad = new Gluecksrad({
                guildId: member.guild.id,
                pool: 1000,
                sonderpool: Math.floor(xpToRemove / 2)
            });
            await newGluecksrad.save();
        }
        return xpToRemove;
    } catch (error) {
        console.log(error);
    }
}

module.exports = removeXP;