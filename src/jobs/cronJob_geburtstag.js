require('dotenv').config();
const cron = require('node-cron');
const Level = require('../models/Level');

let geburtstagJob = null;

function startGeburtstagJob(client) {
    if (geburtstagJob) {
        console.log('Geburtstag-Job is already running.');
        return;
    }
    geburtstagJob = cron.schedule('0 0 * * *', async function () {
        var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
        const allLevels = await Level.find({
            guildId: process.env.GUILD_ID,
        });
        for (const level of allLevels) {
            if (level.birthday) {
                const birthdayDate = new Date(level.birthday);
                const today = new Date();
                if (birthdayDate.getDate() === today.getDate() && birthdayDate.getMonth() === today.getMonth()) {
                    const age = today.getFullYear() - birthdayDate.getFullYear();
                    targetChannel.send(`Herzlichen Glückwunsch an <@${level.userId}>! Heute ist dein Geburtstag und du bist jetzt ${age} Jahre alt! 🎉`);
                }
            }
        }
    });
    console.log('Geburtstag-Job started.');
}

function stopGeburtstagJob() {
    if (geburtstagJob) {
        geburtstagJob.stop();
        geburtstagJob = null;
        console.log('Geburtstag-Job stopped.');
    } else {
        console.log('Geburtstag-Job is not running.');
    }
}

function isGeburtstagJobRunning() {
    return geburtstagJob !== null;
}

module.exports = {
    startGeburtstagJob,
    stopGeburtstagJob,
    isGeburtstagJobRunning
};