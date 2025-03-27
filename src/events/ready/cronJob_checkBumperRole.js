require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');

module.exports = async (client) => {
    cron.schedule('*/6 * * * *', async function () {
        console.log(`VoiceXP-Job started...`);
        try {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            let members = await guild.members.fetch();
            members.forEach(async (member) => {
                const query = {
                    userId: member.user.id,
                    guildId: guild.id,
                };
                const level = await Level.findOne(query);
                if (level) {
                    if (member.roles.cache.some(role => role.name === 'Bumper')) {
                        let now = new Date();
                        let lastbump = level.lastBump;
                        let diffTime = Math.abs(now - lastbump);
                        let diffHour = Math.floor(diffTime / (1000 * 60 * 60));
                        if (diffHour >= 24) {
                            let tempRole = guild.roles.cache.find(role => role.name === 'Bumper');
                            await member.roles.remove(tempRole);
                            console.log(`Role Bumper was removed from user ${member.user.tag}`);
                        }
                    };
                }
            });
        } catch (error) {
            console.log(error);
        }
    });
}
