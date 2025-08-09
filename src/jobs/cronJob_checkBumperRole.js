require('dotenv').config();
const cron = require('node-cron');
const { levelDAO } = require('../utils/initializeDB');

let checkBumperRoleJob = null;

function startJob(client) {
    if (checkBumperRoleJob) {
        console.log('CheckBumperRole-Job is already running.');
        return;
    }
    checkBumperRoleJob = cron.schedule('*/5 * * * *', async function () {
        try {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            const allLevels = await levelDAO.getAllByGuild(process.env.GUILD_ID);
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
    console.log('CheckBumperRole-Job started.');
}

function stopJob() {
    if (checkBumperRoleJob) {
        checkBumperRoleJob.stop();
        checkBumperRoleJob = null;
        console.log('CheckBumperRole-Job stopped.');
    } else {
        console.log('CheckBumperRole-Job is not running.');
    }
}

function isRunning() {
    return checkBumperRoleJob !== null;
}

module.exports = {
    startJob,
    stopJob,
    isRunning
};