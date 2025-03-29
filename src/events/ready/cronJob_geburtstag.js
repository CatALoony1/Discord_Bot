require('dotenv').config();
const cron = require('node-cron');
const Level = require('../../models/Level');

module.exports = async (client) => {
    cron.schedule('0 0 * * *', async function () {
        var targetChannel = await client.channels.fetch(process.env.MORNING_ID);
        const allLevels = await Level.find({
            guildId: process.env.GUILD_ID,
        });
        for (const level of allLevels) {
            if (level.birthday && level.birthday === new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })) {
                targetChannel.send(`Herzlichen Glückwunsch an <@${level.userId}>! Heute ist dein Geburtstag!`);
            }
        }
    });
};