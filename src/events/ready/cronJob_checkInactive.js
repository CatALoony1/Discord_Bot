const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');

module.exports = async (client) => {
    cron.schedule('0 1 * * *', async function () { // 1 Uhr
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
        var playersTags = [];
        for (let i = 0; i < fetchedLevel.length; i++) {
            playersTags[i] = fetchedLevel[i].userName;
        }
        var playerTagsOnServer = [];
        res.forEach((member) => {
            for (let i = 0; i < playersTags.length; i++) {
                if (playersTags[i] === member.user.tag) {
                    let now = new Date();
                    let diffTime = Math.abs(now - fetchedLevel[i].lastMessage);
                    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 30) { //User on Server
                        playersTags[i] = 'good';//TODO check for rework
                    } else {
                        playerTagsOnServer[playerTagsOnServer.length] = playersTags[i];
                    }
                    break;
                }
            }
        });
        for (let i = 0; i < playersTags.length; i++) {
            if (playersTags[i] != 'good') {
                for (let j = 0; j < fetchedLevel.length; j++) {
                    if (playersTags[i] === fetchedLevel[j].userName) {
                        let now = new Date();
                        let diffTime = Math.abs(now - fetchedLevel[i].lastMessage);
                        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays < 30) { //User not on Server
                            playersTags[i] = 'good';
                        }
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < playersTags.length; i++) {
            if (playersTags[i] != 'good') {
                console.log(`User ${playersTags[i]} hasn't send a message in at least 30 Days.`);
                await Level.deleteOne({ guildId: process.env.GUILD_ID, userName: playersTags[i], });
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
            messageUserInactive.setDescription(`${playerTagsOnServer.toString().replace(',', '\n')}`);
            await targetChannel.send({ embeds: [messageUserInactive] });
        }
        console.log(`CheckInactive-Job finished...`);
    });
}