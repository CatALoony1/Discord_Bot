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
            if (level.birthday) {
                const birthdayDate = new Date(level.birthday);
                const today = new Date();
                if (birthdayDate.getDate() === today.getDate() && birthdayDate.getMonth() === today.getMonth()) {
                    const age = today.getFullYear() - birthdayDate.getFullYear();
                    targetChannel.send(`Herzlichen Glückwunsch an <@${level.userId}>! Heute ist dein Geburtstag und du bist jetzt ${age} Jahre alt! 🎉`);
                }
            }
        }
    });
};