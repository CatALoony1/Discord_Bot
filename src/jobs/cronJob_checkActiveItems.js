const Discord = require("discord.js");
require('dotenv').config();
const cron = require('node-cron');
const ActiveItems = require('../models/ActiveItems.js');
const Config = require('../models/Config.js');
const removeMoney = require('../utils/removeMoney.js');
const giveMoney = require('../utils/giveMoney.js');
const { act } = require("react");


let checkActiveItemsJob = null;

function startJob(client) {
    if (checkActiveItemsJob) {
        console.log('CheckActiveItems-Job is already running.');
        return;
    }
    checkActiveItemsJob = cron.schedule('*/5 * * * *', async function () {
        try {
            const guild = await client.guilds.cache.get(process.env.GUILD_ID);
            const activeItems = await ActiveItems.find({});
            const targetChannel = interaction.guild.channels.cache.get(process.env.SPIELE_ID) || (await interaction.guild.channels.fetch(process.env.SPIELE_ID));
            const mainChannel = interaction.guild.channels.cache.get(process.env.MORNING_ID) || (await interaction.guild.channels.fetch(process.env.MORNING_ID));
            const toBeDeleted = [];
            if (activeItems.length > 0) {
                for (const activeItem of activeItems) {
                    if (activeItem.endTime < new Date()) {
                        toBeDeleted.push(activeItem._id);
                        if (activeItem.itemType == 'Bombe') {
                            const amount = getRandom(20000, 40000);
                            await removeMoney(interaction.member, amount, interaction.guild.id);
                            await getTenorGifById("20062805")
                                .then(async (gifUrl) => {
                                    if (!gifUrl.includes("http")) {
                                        console.log("ERROR Bombe gif");
                                        return;
                                    }
                                    await targetChannel.send({
                                        content: `Bei <@${activeItem.usedOn}> ist eine Bombe explodiert! **${amount}** Loserlinge sind verpufft!`,
                                        files: [gifUrl],
                                        allowedMentions: { users: [activeItem.usedOn] }
                                    });
                                })
                                .catch((error) => {
                                    console.error('ERROR:', error);
                                });
                        } else if (activeItem.itemType == 'Doppelte XP') {
                            const xpMultiplier = await Config.findOne({ key: 'xpMultiplier', guildId: interaction.guild.id });
                            if (!xpMultiplier) {
                                await Config.create({ name: 'key', value: 1, guildId: interaction.guild.id });
                            } else {
                                xpMultiplier.value = 1;
                                await xpMultiplier.save();
                            }
                            await mainChannel.send('Die Doppelte XP sind nun abgelaufen.');
                        } else if (activeItem.itemType == 'Schuldschein') {
                            targetChannel.send(`<@${activeItem.user}> dein Schuldschein bei <@${activeItem.usedOn}> ist nun abgelaufen.`);
                        } else if (activeItem.itemType == 'Oberster Platz') {
                            const targetUserObj = await guild.members.fetch(activeItem.user);
                            const role = guild.roles.cache.get('1380423808623841340') || (await guild.roles.fetch('1380423808623841340'));
                            if (!role || !targetUserObj) {
                                console.log('ERROR Job Oberster Platz: Cant find User or Role');
                            }
                            await targetUserObj.roles.remove(role);
                        }
                    } else if (activeItem.itemType == 'Schuldschein') {
                        if (activeItem.extras != new Date().toLocaleDateString) {
                            activeItem.extras = new Date().toLocaleDateString;
                            activeItem.save();
                            const userObj = await guild.members.cache.get(activeItem.user) || (await guild.members.fetch(activeItem.user));
                            const usedOnObj = await guild.members.cache.get(activeItem.usedOn) || (await guild.members.fetch(activeItem.usedOn));
                            await removeMoney(usedOnObj, 500);
                            await giveMoney(userObj, 500, false);
                            await targetChannel.send(`Von <@${activeItem.usedOn}> wurden 500 Loserlinge Schulden an <@${activeItem.user}> übergeben.`);
                        }
                    }
                }
                if (toBeDeleted.length > 0) {
                    await ActiveItems.deleteMany({ _id: { $in: toBeDeleted } });
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
    console.log('CheckActiveItems-Job started.');
}

function stopJob() {
    if (checkActiveItemsJob) {
        checkActiveItemsJob.stop();
        checkActiveItemsJob = null;
        console.log('CheckActiveItems-Job stopped.');
    } else {
        console.log('CheckActiveItems-Job is not running.');
    }
}

function isRunning() {
    return checkActiveItemsJob !== null;
}

module.exports = {
    startJob,
    stopJob,
    isRunning
};

/*
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

  * = jede

*/