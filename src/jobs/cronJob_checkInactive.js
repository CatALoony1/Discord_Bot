const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const Level = require('../models/Level');
const Config = require('../models/Config');
const QuizStats = require('../models/QuizStats');
const GameUser = require('../models/GameUser.js');

let checkInactiveJob = null;

function startJob(client) {
    if (checkInactiveJob) {
        console.log('CheckInactive-Job is already running.');
        return;
    }
    checkInactiveJob = cron.schedule('0 1 * * *', async function () { // 1 Uhr
        console.log(`CheckInactive-Job started...`);
        try {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            let members = await guild.members.fetch();
            const fetchedLevel = await Level.find({
                guildId: process.env.GUILD_ID,
            });
            if (fetchedLevel.length === 0) {
                console.log('ERROR: Niemand auf dem Server hat Level');
                return;
            }
            var away = [];
            for await (const doc of Config.find({guildId: process.env.GUILD_ID})) {
                if (doc.key == "away") {
                    away = doc.value.split(',');
                }
            }
            var playerTags = new Map();
            for (let i = 0; i < fetchedLevel.length; i++) {
                playerTags.set(fetchedLevel[i].userName, fetchedLevel[i]);
            }
            var playerTagsOnServer = [];
            var playerTagsLurk = new Map();
            var playerTagsGood = [];
            members.forEach(async (member) => {
                if (!(away.length != 0 && away.includes(member.user.tag)) && !member.user.bot) {
                    let vorhanden = 0;
                    for (const key of playerTags.keys()) {
                        if (key == member.user.tag) {
                            let now = new Date();
                            var lastMessage = playerTags.get(key).lastMessage;
                            let diffTime = Math.abs(now - lastMessage);
                            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            console.log(`DB and Server: ${member.user.tag}: ${diffDays}`);
                            if (diffDays < 30) { //User on Server
                                playerTagsGood[playerTagsGood.length] = key;
                                vorhanden = 1;
                            } else {
                                playerTagsOnServer[playerTagsOnServer.length] = member.user.tag;
                                playerTagsGood[playerTagsGood.length] = key;
                                vorhanden = 1;
                            }
                            break;
                        }
                    }
                    if (vorhanden == 0) {
                        let now = new Date();
                        let joinDate = member.joinedAt;
                        let diffTime = Math.abs(now - joinDate);
                        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        console.log(`Not DB: ${member.user.id}: ${diffDays}`);
                        if (diffDays >= 15) { //User on Server, not DB
                            playerTagsLurk.set(member.user.tag, member.user.id);
                        }
                    }
                }
            });
            if (away.length != 0) {
                for (const key of playerTags.keys()) {
                    if (away.includes(key) && !playerTagsGood.includes(key)) {
                        playerTagsGood[playerTagsGood.length] = key;
                        console.log(`Away: ${key}`);
                    }
                }
            }
            for (const key of playerTags.keys()) {
                if (!playerTagsGood.includes(key)) {
                    for (let j = 0; j < fetchedLevel.length; j++) {
                        if (key === fetchedLevel[j].userName) {
                            let now = new Date();
                            let diffTime = Math.abs(now - fetchedLevel[j].lastMessage);
                            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            console.log(`DB not Server: ${key}: ${diffDays}`);
                            if (diffDays < 30) { //User not on Server
                                playerTagsGood[playerTagsGood.length] = key;
                            }
                            break;
                        }
                    }
                }
            }
            for (const key of playerTagsGood) {
                playerTags.delete(key);
            }
            const fetchedQuizstats = await QuizStats.find({
                guildId: process.env.GUILD_ID,
            });
            var quizUserIds = [];
            for (let stat of fetchedQuizstats) {
                quizUserIds[quizUserIds.length] = stat.userId;
            }
            for (const key of playerTags.keys()) {
                console.log(`User ${key} hasn't send a message in at least 30 Days.`);
                await Level.deleteOne({ guildId: process.env.GUILD_ID, userName: key, });
                await GameUser.deleteOne({ guildId: process.env.GUILD_ID, userId: playerTags.get(key), });
                if (quizUserIds.includes(playerTags.get(key).userId)) {
                    await QuizStats.deleteOne({ guildId: process.env.GUILD_ID, userId: playerTags.get(key), });
                }
            }
            var playerLurkArray = [];
            for (const key of playerTagsLurk.keys()) {
                playerLurkArray[playerLurkArray.length] = key;
                console.log(`User ${key} hasn't send a message in at least 15 Days.`);
                await GameUser.deleteOne({ guildId: process.env.GUILD_ID, userId: playerTags.get(key), });
                if (quizUserIds.includes(playerTagsLurk.get(key))) {
                    await QuizStats.deleteOne({ guildId: process.env.GUILD_ID, userId: playerTagsLurk.get(key), });
                }
            }

            if (playerTagsOnServer.length != 0) {
                const targetChannel = await client.channels.fetch(process.env.LOG_ID);
                if (!targetChannel) {
                    console.log('Fehler, Logchannel gibts nicht');
                    return;
                }
                const messageUserInactive = new Discord.EmbedBuilder();
                messageUserInactive.setColor(0xff0000);
                messageUserInactive.setTimestamp(Date.now());
                messageUserInactive.setTitle(`Folgende User haben seit 30 Tagen nichts geschrieben:`);
                messageUserInactive.setDescription(`${playerTagsOnServer.toString().replaceAll(',', '\n')}`);
                await targetChannel.send({ embeds: [messageUserInactive] });
            }
            if (playerTagsLurk.size != 0) {
                const targetChannel = await client.channels.fetch(process.env.LOG_ID);
                if (!targetChannel) {
                    console.log('Fehler, Logchannel gibts nicht');
                    return;
                }
                const messageUserInactiveLurk = new Discord.EmbedBuilder();
                messageUserInactiveLurk.setColor(0xff0000);
                messageUserInactiveLurk.setTimestamp(Date.now());
                messageUserInactiveLurk.setTitle(`Seit 15 Tagen auf dem Server, nur am lurken`);
                messageUserInactiveLurk.setDescription(`${playerLurkArray.toString().replaceAll(',', '\n')}`);
                await targetChannel.send({ embeds: [messageUserInactiveLurk] });
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