const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');
const Config = require('../../models/Config');
const QuizStats = require('../../models/QuizStats');

module.exports = async (client) => {
    cron.schedule('0 1 * * *', async function () { // 1 Uhr
        await console.log(`CheckInactive-Job started...`);
        try {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            let members = await guild.members.fetch();
            const fetchedLevel = await Level.find({
                guildId: process.env.GUILD_ID,
            });
            if (fetchedLevel.length === 0) {
                await console.log('ERROR: Niemand auf dem Server hat Level')
                return;
            }
            var away = [];
            for await (const doc of Config.find()) {
                if (doc.key == "away") {
                    away = doc.value.split(',');
                }
            }
            var playerTags = new Map();
            for (let i = 0; i < fetchedLevel.length; i++) {
                playerTags.set(fetchedLevel[i].userName, fetchedLevel[i].userId);
            }
            var playerTagsOnServer = [];
            var playerTagsLurk = new Map();
            members.forEach(async (member) => {
                if (!(away.length != 0 && away.includes(member.user.tag)) && !member.user.bot) {
                    for (let i = 0; i < playerTags.keys().length; i++) {
                        if (playerTags.keys()[i] === member.user.tag) {
                            let now = new Date();
                            let diffTime = Math.abs(now - fetchedLevel[i].lastMessage);
                            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays < 30) { //User on Server
                                playerTags.keys()[i] = 'good';
                            } else {
                                playerTagsOnServer[playerTagsOnServer.length] = member.user.tag;
                            }
                            break;
                        }
                        if (i == (playerTags.keys().length - 1)) {
                            let now = new Date();
                            let joinDate = member.joinedAt;
                            let diffTime = Math.abs(now - joinDate);
                            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays >= 15) { //User on Server, not DB
                                playerTagsLurk.set(member.user.tag, member.user.id);
                            }
                        }
                    }
                }
            });
            if (away.length != 0) {
                for (let i = 0; i < playerTags.keys().length; i++) {
                    if (away.includes(playerTags.keys()[i])) {
                        playerTags.keys()[i] = 'good';
                    }
                }
            }
            for (let i = 0; i < playerTags.keys().length; i++) {
                if (playerTags.keys()[i] != 'good') {
                    if (!(away.length != 0 && away.includes(playerTags.keys()[i]))) {
                        for (let j = 0; j < fetchedLevel.length; j++) {
                            if (playerTags.keys()[i] === fetchedLevel[j].userName) {
                                let now = new Date();
                                let diffTime = Math.abs(now - fetchedLevel[i].lastMessage);
                                let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                if (diffDays < 30) { //User not on Server
                                    playerTags.keys()[i] = 'good';
                                }
                                break;
                            }
                        }
                    }
                }
            }
            const fetchedQuizstats = await QuizStats.find({
                guildId: process.env.GUILD_ID,
            });
            var quizUserIds = [];
            for (let stat of fetchedQuizstats) {
                quizUserIds[quizUserIds.length] = stat.userId;
            }
            for (let i = 0; i < playerTags.keys().length; i++) {
                if (playerTags.keys()[i] != 'good') {
                    await console.log(`User ${playerTags.keys()[i]} hasn't send a message in at least 30 Days.`);
                    await Level.deleteOne({ guildId: process.env.GUILD_ID, userName: playerTags.keys()[i], });
                    if (quizUserIds.includes(playerTags.get(playerTags.keys[i]))) {
                        await QuizStats.deleteOne({ guildId: process.env.GUILD_ID, userId: playerTags.get(playerTags.keys[i]), });
                    }
                }
            }
            for (let i = 0; i < playerTagsLurk.keys().length; i++) {
                await console.log(`User ${playerTagsLurk.keys()[i]} hasn't send a message in at least 15 Days.`);
                if (quizUserIds.includes(playerTagsLurk.get(playerTagsLurk.keys[i]))) {
                    await QuizStats.deleteOne({ guildId: process.env.GUILD_ID, userId: playerTagsLurk.get(playerTagsLurk.keys[i]), });
                }
            }

            if (playerTagsOnServer.length != 0) {
                const targetChannel = await client.channels.fetch(process.env.LOG_ID);
                if (!targetChannel) {
                    await console.log('Fehler, Logchannel gibts nicht');
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
                    await console.log('Fehler, Logchannel gibts nicht');
                    return;
                }
                const messageUserInactiveLurk = new Discord.EmbedBuilder();
                messageUserInactiveLurk.setColor(0xff0000);
                messageUserInactiveLurk.setTimestamp(Date.now());
                messageUserInactiveLurk.setTitle(`Seit 15 Tagen auf dem Server, nur am lurken`);
                messageUserInactiveLurk.setDescription(`${playerTagsLurk.toString().replaceAll(',', '\n')}`);
                await targetChannel.send({ embeds: [messageUserInactiveLurk] });
            }
        } catch (err) {
            await console.log(err);
        }
        await console.log(`CheckInactive-Job finished...`);
    });
}