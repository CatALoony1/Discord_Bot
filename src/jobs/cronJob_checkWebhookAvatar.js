require('dotenv').config();
const cron = require('node-cron');
const Begruessung = require('../models/Begruessung');

let checkWebhookAvatarJob = null;

function startJob(client) {
    if (checkWebhookAvatarJob) {
        console.log('CheckWebhookAvatar-Job is already running.');
        return;
    }
    checkWebhookAvatarJob = cron.schedule('0 2 * * *', async function () {
        try {
            const targetChannel = guildMember.guild.channels.cache.get(process.env.WELCOME_ID) || (await guildMember.guild.channels.fetch(process.env.WELCOME_ID));
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            const allBegruessungen = await Begruessung.find({
                guildId: process.env.GUILD_ID,
            });
            await targetChannel.fetchWebhooks()
                .then(hooks => {
                    hooks.forEach(async hook => {
                        const begruessung = allBegruessungen.find(b => b.webhookId === hook.id && b.webhookToken === hook.token);
                        if (begruessung) {
                            let targetUserObj = await guild.members.cache.get(begruessung.authorId);
                            if (targetUserObj.displayAvatarURL({ size: 256 }) == hook.avatar) {
                                console.log(`Webhook ${hook.name} (${hook.id}) avatar is correct.`)
                            } else {
                                console.log(`Webhook ${hook.name} (${hook.id}) avatar is incorrect.`);
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
                    });
                    console.log(`Dieser Kanal hat ${hooks.size} Hooks.`);
                })
                .catch(console.error);
        } catch (error) {
            console.log(error);
        }
    });
    console.log('CheckWebhookAvatar-Job started.');
}

function stopJob() {
    if (checkWebhookAvatarJob) {
        checkWebhookAvatarJob.stop();
        checkWebhookAvatarJob = null;
        console.log('CheckWebhookAvatar-Job stopped.');
    } else {
        console.log('CheckWebhookAvatar-Job is not running.');
    }
}

function isRunning() {
    return checkWebhookAvatarJob !== null;
}

module.exports = {
    startJob,
    stopJob,
    isRunning
};