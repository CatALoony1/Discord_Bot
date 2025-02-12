const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');
const Config = require('../../models/Config');

module.exports = async (client) => {
    //cron.schedule('0 1 * * *', async function () { // 1 Uhr
    cron.schedule('*/5 * * * *', async function () {
        console.log(`CheckInactive-Job started...`);
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        let res = await guild.members.fetch();
        const fetchedLevel = await Level.find({
            guildId: process.env.GUILD_ID,
        });
        if (fetchedLevel.length === 0) {
            console.log('ERROR: Niemand auf dem Server hat Level')
            return;
        }
        var away = [];
        for await (const doc of Config.find()) {
            if (doc.key == "away") {
                away = doc.value.split(',');
            }
        }
        console.log(away);
        var playerTags = [];
        for (let i = 0; i < fetchedLevel.length; i++) {
            playerTags[i] = fetchedLevel[i].userName;
        }
        var playerTagsOnServer = [];
        var playerTagsLurk = [];
        console.log(res);
        res.forEach((member) => {
            console.log(member.user.tag);
            if (!(away.length != 0 && away.includes(member.user.tag))) {
                console.log(1);
                for (let i = 0; i < playerTags.length; i++) {
                    console.log(2);
                    if (playerTags[i] === member.user.tag) {
                        console.log(3);
                        let now = new Date();
                        let diffTime = Math.abs(now - fetchedLevel[i].lastMessage);
                        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays < 30) { //User on Server
                            playerTags[i] = 'good';
                        } else {
                            playerTagsOnServer[playerTagsOnServer.length] = playerTags[i];
                        }
                        console.log(4);
                        console.log(playerTags);
                        break;
                    }
                    console.log(5);
                    if (i == (playerTags.length - 1)) {
                        console.log(6);
                        let now = new Date();
                        let diffTime = Math.abs(now - member.joinedAt());
                        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        console.log(diffDays);
                        if (diffDays >= 15) { //User on Server, not DB
                            playerTagsLurk[playerTagsLurk.length] = playerTags[i];
                        }
                    }
                }
            }
        });
        console.log(playerTagsLurk);
        for (let i = 0; i < playerTags.length; i++) {
            if (playerTags[i] != 'good') {
                if (!(away.length != 0 && away.includes(playerTags[i]))) {
                    for (let j = 0; j < fetchedLevel.length; j++) {
                        if (playerTags[i] === fetchedLevel[j].userName) {
                            let now = new Date();
                            let diffTime = Math.abs(now - fetchedLevel[i].lastMessage);
                            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays < 30) { //User not on Server
                                playerTags[i] = 'good';
                            }
                            break;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < playerTags.length; i++) {
            if (playerTags[i] != 'good') {
                console.log(`User ${playerTags[i]} hasn't send a message in at least 30 Days.`);
                await Level.deleteOne({ guildId: process.env.GUILD_ID, userName: playerTags[i], });
            }
        }
        for (let i = 0; i < playerTagsLurk.length; i++) {
            console.log(`User ${playerTagsLurk[i]} hasn't send a message in at least 15 Days.`);
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
            messageUserInactive.setDescription(`${playerTagsOnServer.toString().replace(',', '\n')}`);
            await targetChannel.send({ embeds: [messageUserInactive] });
        }
        if (playerTagsLurk.length != 0) {
            const targetChannel = await client.channels.fetch(process.env.LOG_ID);
            if (!targetChannel) {
                console.log('Fehler, Logchannel gibts nicht');
                return;
            }
            const messageUserInactive = new Discord.EmbedBuilder();
            messageUserInactive.setColor(0xff0000);
            messageUserInactive.setTimestamp(Date.now());
            messageUserInactive.setTitle(`Seit 15 Tagen auf dem Server, nur am lurken`);
            messageUserInactive.setDescription(`${playerTagsLurk.toString().replace(',', '\n')}`);
            await targetChannel.send({ embeds: [messageUserInactive] });
        }
        console.log(`CheckInactive-Job finished...`);
    });
}