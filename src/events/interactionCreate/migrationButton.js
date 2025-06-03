const { MessageFlags } = require('discord.js');
const giveMoney = require('../../utils/giveMoney');
const Levels = require('../../models/Levels.js');
const calculateLevel = require('../../utils/calculateLevel');

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

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('migratexp')) return;
    try {
        const customId = interaction.customId;
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        targetUserObj = interaction.member;
        if (customId === 'migratexp') {
            const level = await Levels.findOne({
                userId: interaction.member.user.id,
                guildId: interaction.guild.id,
            });
            if (!level) {
                await interaction.editReply('Du hast keine XP, die du umwandeln könntest.');
                return;
            }
            const allxp = level.voicexp + level.messagexp;
            let money = 0;
            if (level.allxp > allxp) {
                money = (level.allxp - allxp) * 2;
            } else {
                money = 100;
            }
            level.allxp = allxp;
            let xpCheck = true;
            level.level = 0;
            level.xp = allxp
            do {
                let neededXP = calculateLevel(levelNumber);
                if (level.xp >= neededXP) {
                    level.level += 1;
                    level.xp -= neededXP;
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
                        console.log(`Role ${role.name} was given to user ${member.user.tag}`);
                    }
                } else {
                    xpCheck = false;
                }
            } while (xpCheck);
            level.save();
            giveMoney(interaction.member, money, false);
            interaction.editReply(`Du hast deine XP erfolgreich in Geld umgewandelt. Du hast ${money} Geld erhalten.`);
            const role = interaction.guild.roles.cache.find(r => r.name === 'Spielkind');
            if (role) {
                await interaction.member.roles.add(role);
            }
            return;
        }
        if (customId === 'notmigratexp') {
            const role = interaction.guild.roles.cache.find(r => r.name === 'Spielkind');
            if (role) {
                await interaction.member.roles.add(role);
                await giveMoney(interaction.member, 100, false);
                interaction.editReply('Du hast dich entschieden, deine XP zu behalten. Du hast 100 Geld Startguthaben erhalten.');
            } else {
                interaction.editReply('Die Rolle "Spielkind" wurde nicht gefunden.');
            }
            return;
        }
    } catch (error) {
        console.log(error);
    }
};