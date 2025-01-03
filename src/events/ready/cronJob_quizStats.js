const { Client, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const createQuizLeaderboardEmbeds = require("../../utils/createQuizLeaderboardEmbeds");
const cron = require('node-cron');

module.exports = async (client) => {
    cron.schedule('11 1 * * 7', async function () {
        var targetChannel = await client.channels.fetch(process.env.QUIZ_ID);
        const embed = await createQuizLeaderboardEmbeds(0, client);
        const pageDownButton = new ButtonBuilder()
            .setEmoji('⬅️')
            .setLabel('Zurück')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`qPageDown`);

        const pageUpButton = new ButtonBuilder()
            .setEmoji('➡️')
            .setLabel('Vorwärts')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`qPageUp`);

        const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton);

        targetChannel.send({
            embeds: [embed],
            components: [firstRow]
        })
    });
};