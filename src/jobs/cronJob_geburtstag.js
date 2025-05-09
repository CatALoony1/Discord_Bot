require('dotenv').config();
const cron = require('node-cron');
const Level = require('../models/Level');

let geburtstagJob = null;

function startJob(client) {
    if (geburtstagJob) {
        console.log('Geburtstag-Job is already running.');
        return;
    }
    geburtstagJob = cron.schedule('0 0 * * *', async function () {
        await jobFunction(client).catch((error) => {
            console.log(error);
        });
    });
    console.log('Geburtstag-Job started.');
}

function stopJob() {
    if (geburtstagJob) {
        geburtstagJob.stop();
        geburtstagJob = null;
        console.log('Geburtstag-Job stopped.');
    } else {
        console.log('Geburtstag-Job is not running.');
    }
}

function isRunning() {
    return geburtstagJob !== null;
}

async function jobFunction(client) {
    var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    const allLevels = await Level.find({
        guildId: process.env.GUILD_ID,
    });
    console.log(allLevels);
    var oldUsers = [];
    for (let j = 0; j < allLevels.length; j++) {
        if (!(guild.members.cache.find(m => m.id === allLevels[j].userId)?.id)) {
            oldUsers[oldUsers.length] = j;
        }
    }
    for (let j = 0; j < oldUsers.length; j++) {
        allLevels.splice(oldUsers[j] - j, 1);
    }
    for (const level of allLevels) {
        console.log(level.birthday);
        if (level.birthday) {
            console.log(level);
            const birthdayDate = new Date(level.birthday);
            const today = new Date();
            console.log(birthdayDate);
            console.log(today);
            console.log(birthdayDate.getDate() === today.getDate());
            console.log(birthdayDate.getDate() == today.getDate());
            console.log(birthdayDate.getMonth() === today.getMonth());
            console.log(birthdayDate.getMonth() === today.getMonth());
            if (birthdayDate.getDate() === today.getDate() && birthdayDate.getMonth() === today.getMonth()) {
                const age = today.getFullYear() - birthdayDate.getFullYear();
                console.log(age);
                //targetChannel.send(`Herzlichen Glückwunsch an <@${level.userId}>! Heute ist dein Geburtstag und du bist jetzt ${age} Jahre alt! 🎉`);
            }
        }
    }
}

module.exports = {
    startJob,
    stopJob,
    isRunning,
    jobFunction
};