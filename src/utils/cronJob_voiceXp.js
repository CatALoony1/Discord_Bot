require('dotenv').config();
const cron = require('node-cron');
const Config = require('../models/Config');
const giveXP = require('./giveXP');

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let voiceXpJob = null;

function startVoiceXpJob(client) {
    if (voiceXpJob) {
        console.log('VoiceXP-Job is already running.');
        return;
    }
    voiceXpJob = cron.schedule('*/5 * * * *', async function () {
        console.log(`VoiceXP-Job started...`);
        var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
        let confQuery = {
            key: "xpMultiplier"
        };
        let conf = await Config.findOne(confQuery);
        let multiplier = 1;
        if (conf) {
            multiplier = Number(conf.value);
        }
        await client.channels.cache.forEach(async (channel) => {
            if (channel.type == 2 && channel.id != '1307820687599337602') {
                if (channel.members.size >= 2) {
                    channel.members.forEach(async (member) => {
                        let xpToGive = 5 * getRandomXp(1, 5) * multiplier;
                        giveXP(member, xpToGive, 0, targetChannel, false, true, false);
                    });
                }
            }
        });
        console.log(`VoiceXP-Job finished`);
    });
    console.log('VoiceXP-Job started.');
}

function stopVoiceXpJob() {
    if (voiceXpJob) {
        voiceXpJob.stop();
        voiceXpJob = null;
        console.log('VoiceXP-Job stopped.');
    } else {
        console.log('VoiceXP-Job is not running.');
    }
}

function isVoiceXpJobRunning() {
    return voiceXpJob !== null;
}

module.exports = {
    startVoiceXpJob,
    stopVoiceXpJob,
    isVoiceXpJobRunning
};