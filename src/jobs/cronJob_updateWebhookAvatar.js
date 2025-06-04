require('dotenv').config();
const cron = require('node-cron');
const Begruessung = require('../models/Begruessung');

let updateWebhookAvatarJob = null;

function startJob(client) {
    if (updateWebhookAvatarJob) {
        console.log('UpdateWebhookAvatar-Job is already running.');
        return;
    }
    updateWebhookAvatarJob = cron.schedule('0 2 * * *', async function () {
        await jobFunction(client).catch((error) => {
            console.log(error);
        });
    });
    console.log('UpdateWebhookAvatar-Job started.');
}

function stopJob() {
    if (updateWebhookAvatarJob) {
        updateWebhookAvatarJob.stop();
        updateWebhookAvatarJob = null;
        console.log('UpdateWebhookAvatar-Job stopped.');
    } else {
        console.log('UpdateWebhookAvatar-Job is not running.');
    }
}

function isRunning() {
    return updateWebhookAvatarJob !== null;
}

async function jobFunction(client) {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const targetChannel = guild.channels.cache.get(process.env.WELCOME_ID) || (await guild.channels.fetch(process.env.WELCOME_ID));
        const allBegruessungen = await Begruessung.find({
            guildId: process.env.GUILD_ID,
        });
        await targetChannel.fetchWebhooks()
            .then(hooks => {
                hooks.forEach(async hook => {
                    const begruessung = allBegruessungen.find(b => b.webhookId === hook.id && b.webhookToken === hook.token);
if(begruessung){
                    const [, authorId] = begruessung.authorId.split(';');
if (begruessung && guild.members.cache.find(m => m.id === begruessung.authorId)?.id || (authorId && guild.members.cache.find(m => m.id === authorId)?.id)) {
                        const trueAuthor = (authorId === undefined) ? begruessung.authorId : authorId;
let targetUserObj = await guild.members.cache.get(trueAuthor);
                        try {
                            await hook.edit({
                                avatar: targetUserObj.displayAvatarURL({ size: 256 }),
                            });
                            console.log(`Webhook ${hook.name} (${hook.id}) avatar updated.`);
                        } catch (error) {
                            console.error(`Error updating webhook ${hook.name} (${hook.id}) avatar:`, error);
                        }
                    } else {
                        console.log(`Webhook ${hook.name} (${hook.id}) not found in database.`);
                    }
                });
                console.log(`Dieser Kanal hat ${hooks.size} Hooks.`);
            })
            .catch(console.error);
        const messeChannel = guild.channels.cache.get(process.env.MESSE_ID) || (await guild.channels.fetch(process.env.MESSE_ID));
        await messeChannel.fetchWebhooks()
            .then(hooks => {
                hooks.forEach(async hook => {
                    const begruessung = allBegruessungen.find(b => b.webhookId === hook.id && b.webhookToken === hook.token);
                    if (begruessung) {
                        const [, authorId] = begruessung.authorId.split(';');
                        if (guild.members.cache.find(m => m.id === authorId)?.id) {
                            let targetUserObj = await guild.members.cache.get(authorId);
                            try {
                                await hook.edit({
                                    avatar: targetUserObj.displayAvatarURL({ size: 256 }),
                                });
                                console.log(`Webhook ${hook.name} (${hook.id}) avatar updated.`);
                            } catch (error) {
                                console.error(`Error updating webhook ${hook.name} (${hook.id}) avatar:`, error);
                            }
                        }
                    } else {
                        console.log(`Webhook ${hook.name} (${hook.id}) not found in database.`);
                    }
}
                });
                console.log(`Dieser Kanal hat ${hooks.size} Hooks.`);
            })
            .catch(console.error);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    startJob,
    stopJob,
    isRunning,
    jobFunction
};