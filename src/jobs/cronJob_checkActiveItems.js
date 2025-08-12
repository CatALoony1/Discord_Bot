require('dotenv').config();
const cron = require('node-cron');
const Config = require('../sqliteModels/Config.js');
const { getDaos } = require('../utils/daos.js');
const removeMoney = require('../utils/removeMoney.js');
const giveMoney = require('../utils/giveMoney.js');
const getTenorGifById = require('../utils/getTenorGifById.js');


let checkActiveItemsJob = null;

function startJob(client) {
    if (checkActiveItemsJob) {
        console.log('CheckActiveItems-Job is already running.');
        return;
    }
    checkActiveItemsJob = cron.schedule('*/5 * * * *', async function () {
        try {
            const { activeItemsDAO, configDAO } = getDaos();
            const guild = await client.guilds.cache.get(process.env.GUILD_ID);
            const activeItems = await activeItemsDAO.getAll();
            const targetChannel = guild.channels.cache.get(process.env.SPIELE_ID) || (await guild.channels.fetch(process.env.SPIELE_ID));
            const mainChannel = guild.channels.cache.get(process.env.ALLGEMEIN_ID) || (await guild.channels.fetch(process.env.ALLGEMEIN_ID));
            const toBeDeleted = [];
            if (activeItems.length > 0) {
                for (const activeItem of activeItems) {
                    if (activeItem.endTime < new Date()) {
                        console.log(`Deleting expired active item: ${activeItem.itemType} for user ${activeItem.user}`);
                        toBeDeleted.push(activeItem._id);
                        if (activeItem.itemType == 'Bombe') {
                            const amount = getRandom(20000, 40000);
                            const usedOnObj = await guild.members.cache.get(activeItem.usedOn) || (await guild.members.fetch(activeItem.usedOn));
                            if (usedOnObj) {
                                await removeMoney(usedOnObj, amount);
                                await getTenorGifById("20062805")
                                    .then(async (gifUrl) => {
                                        if (!gifUrl.includes("http")) {
                                            console.log("ERROR Bombe gif");
                                            return;
                                        }
                                        await targetChannel.send({
                                            content: `Bei <@${activeItem.usedOn}> ist eine Bombe explodiert! **${amount}** Blattläuse sind verpufft!`,
                                            files: [gifUrl]
                                        });
                                    })
                                    .catch((error) => {
                                        console.error('ERROR:', error);
                                    });
                            }
                        } else if (activeItem.itemType == 'Doppelte XP') {
                            const xpMultiplier = await configDAO.getOneByKeyAndGuild('xpMultiplier', guild.id);
                            if (!xpMultiplier) {
                                configDAO.insert(new Config(null, guild.id, 'xpMultiplier', '1'));
                            } else {
                                xpMultiplier.value = '1';
                                await configDAO.update(xpMultiplier);
                            }
                            await mainChannel.send('Die Doppelte XP sind nun abgelaufen.');
                        } else if (activeItem.itemType == 'Schuldschein') {
                            targetChannel.send(`<@${activeItem.user}> dein Schuldschein bei <@${activeItem.usedOn}> ist nun abgelaufen.`);
                        } else if (activeItem.itemType == 'Oberster Platz') {
                            const targetUserObj = await guild.members.fetch(activeItem.user);
                            const role = guild.roles.cache.get('1387041004179296439') || (await guild.roles.fetch('1387041004179296439'));
                            if (!role || !targetUserObj) {
                                console.log('ERROR Job Oberster Platz: Cant find User or Role');
                            } else {
                                await targetUserObj.roles.remove(role);
                            }
                        }
                    } else if (activeItem.itemType == 'Schuldschein') {
                        if (activeItem.extras != new Date().toLocaleDateString()) {
                            activeItem.extras = new Date().toLocaleDateString();
                            await activeItemsDAO.update(activeItem);
                            const userObj = await guild.members.cache.get(activeItem.user) || (await guild.members.fetch(activeItem.user));
                            const usedOnObj = await guild.members.cache.get(activeItem.usedOn) || (await guild.members.fetch(activeItem.usedOn));
                            if (userObj && usedOnObj) {
                                await removeMoney(usedOnObj, 1000);
                                await giveMoney(userObj, 1000);
                                await targetChannel.send(`Von <@${activeItem.usedOn}> wurden 1000 Blattläuse Schulden an <@${activeItem.user}> übergeben.`);
                            }
                        }
                    }
                }
                if (toBeDeleted.length > 0) {
                    await activeItemsDAO.deleteMany(toBeDeleted);
                    console.log(`Deleted ${toBeDeleted.length} expired active items.`);
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

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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