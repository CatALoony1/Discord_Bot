require('dotenv').config();
const Tiere = require('../models/Tiere');
const fs = require('fs').promises;
const path = require('path');
const Level = require('../models/Level');
const calculateLevelXp = require('../utils/calculateLevelXp');
const giveMoney = require('../utils/giveMoney');

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

const animalFoler = './animals';

function getTierart(filename) {
    const basename = path.basename(filename, '.webp');
    const tierart = basename.replace(/\d+$/, '');
    return tierart;
}

async function jobFunction(client) {
    let localAnimals = [];
    try {
        const allLocalFiles = await fs.readdir(animalFoler);
        localAnimals = allLocalFiles.filter(file => path.extname(file).toLowerCase() === '.webp');
        console.log(`Gefundene Tierbilder: ${localAnimals.length}`);
        const existingTierDokumente = await Tiere.find({}, 'pfad -_id').lean();
        const existingPfade = new Set(existingTierDokumente.map(doc => doc.pfad));
        const newTiereToAdd = [];
        for (const filename of localAnimals) {
            const filenameWithoutExtension = path.basename(filename, '.webp');
            if (!existingPfade.has(filenameWithoutExtension)) {
                const tierart = getTierart(filename);
                const newTier = {
                    pfad: filenameWithoutExtension,
                    tierart: tierart,
                };
                newTiereToAdd.push(newTier);
            }
        }
        if (newTiereToAdd.length > 0) {
            console.log(`Neue Tierbilder zum Hinzufügen: ${newTiereToAdd.length}`);
            const result = await Tiere.insertMany(newTiereToAdd, { ordered: false });
            console.log(`Erfolgreich hinzugefügt: ${result.length} neue Tierbilder.`);
        } else {
            console.log('Keine neuen Tierbilder zum Hinzufügen.');
        }

        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const role = await guild.roles.fetch('1379457961931309137');
        if (role) {
            guild.members.fetch();
            const membersWithoutRole = guild.members.cache.filter(member => !member.roles.cache.has(role.id));
            if (membersWithoutRole.size > 0) {
                console.log(`Es gibt ${membersWithoutRole.size} Mitglieder ohne die Spielkind-Rolle.`);
                for (const member of membersWithoutRole.values()) {
                    await member.roles.add(role);
                    console.log(`Rolle 'Spielkind' zu Mitglied ${member.user.tag} hinzugefügt.`);
                    const level = await Level.findOne({
                        userId: member.user.id,
                        guildId: guild.id,
                    });
                    if (level) {
                        const allxp = level.voicexp + level.messagexp;
                        let money = 0;
                        if (level.allxp > allxp) {
                            money = ((level.allxp - allxp) * 2) + 1000;
                        } else {
                            money = 1000;
                        }
                        level.allxp = allxp;
                        let xpCheck = true;
                        level.level = 0;
                        level.xp = allxp;
                        do {
                            let neededXP = calculateLevelXp(level.level);
                            if (level.xp >= neededXP) {
                                level.level += 1;
                                level.xp -= neededXP;
                                if (roles.has(level.level)) {
                                    let newRole = roles.get(level.level);
                                    for (const value of roles.values()) {
                                        if (member.roles.cache.has(value)) {
                                            let tempRole = guild.roles.cache.get(value);
                                            await member.roles.remove(tempRole);
                                            console.log(`Role ${value} was removed from user ${member.user.tag}`);
                                        }
                                    }
                                    let role = guild.roles.cache.get(newRole);
                                    await member.roles.add(role);
                                    console.log(`Role ${role.name} was given to user ${member.user.tag}`);
                                }
                            } else {
                                xpCheck = false;
                            }
                        } while (xpCheck);
                        level.save();
                        giveMoney(member, money, false);
                        interaction.editReply(`Du hast deine XP erfolgreich in Loserlinge umgewandelt. Du hast ${money} Geld erhalten.`);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

module.exports = {
    jobFunction
};