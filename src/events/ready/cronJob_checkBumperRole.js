require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');

module.exports = async (client) => {
    cron.schedule('*/5 * * * *', async function () {
        try {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            const allLevels = await Level.find({
                guildId: process.env.GUILD_ID,
            });
            for (const level of allLevels) {
                if (level.lastBump) {
                    let now = new Date();
                    let lastbump = level.lastBump;
                    let diffTime = Math.abs(now - lastbump);
                    let diffHour = Math.floor(diffTime / (1000 * 60 * 60));
                    if (diffHour == 24) {
                        let targetUserObj = await guild.members.cache.get(level.userId);
                        if (targetUserObj.roles.cache.some(role => role.name === 'Bumper')) {
                            let tempRole = guild.roles.cache.find(role => role.name === 'Bumper');
                            await targetUserObj.roles.remove(tempRole);
                            console.log(`Role Bumper was removed from user ${level.userName}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};
