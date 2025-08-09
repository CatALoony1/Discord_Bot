const cron = require('node-cron');
const { bankkontenDAO, gameUserDAO } = require('../utils/initializeDB.js');

let checkInactiveJob = null;

function startJob(client) {
    if (checkInactiveJob) {
        console.log('CheckInactive-Job is already running.');
        return;
    }
    checkInactiveJob = cron.schedule('10 0 * * *', async function () { // 0:10 Uhr
        console.log(`CheckInactive-Job started...`);
        try {
            const bankkontenZinsen = await bankkontenDAO.getAllWithZinsen();
            const bankkontenToSave = [];
            if (bankkontenZinsen && bankkontenZinsen.length > 0) {
                for (const bankkonto of bankkontenZinsen) {
                    const user = bankkonto.besitzerObj;
                    if (!user) continue;
                    const member = await client.guilds.cache.get(user.guildId)?.members.fetch(user.userId).catch(() => null);
                    if (!member) continue;
                    let zinsen = Math.floor((bankkonto.currentMoney * bankkonto.zinsProzent) / 100);
                    if (member.roles.cache.some(role => role.name === 'Bumper')) {
                        zinsen = Math.ceil(zinsen * 1.15);
                    }
                    if (member.roles.cache.some(role => role.name === 'Server Booster')) {
                        zinsen = Math.ceil(zinsen * 1.15);
                    }
                    bankkonto.currentMoney += zinsen;
                    bankkonto.moneyGain += zinsen;
                    bankkontenToSave.push(bankkonto);
                    console.log(`Zinsen von ${zinsen} für User ${user.userId} hinzugefügt.`);
                }
                if (bankkontenToSave.length > 0) {
                    await bankkontenDAO.updateMany(bankkontenToSave);
                    console.log(`${bankkontenToSave.length} Bankkonten haben Zinsen erhalten.`);
                }
            }
        } catch (err) {
            console.log(err);
        }
        console.log(`CheckInactive-Job finished...`);
    });
    console.log('CheckInactive-Job started.');
}

function stopJob() {
    if (checkInactiveJob) {
        checkInactiveJob.stop();
        checkInactiveJob = null;
        console.log('CheckInactive-Job stopped.');
    } else {
        console.log('CheckInactive-Job is not running.');
    }
}

function isRunning() {
    return checkInactiveJob !== null;
}

module.exports = {
    startJob,
    stopJob,
    isRunning
};