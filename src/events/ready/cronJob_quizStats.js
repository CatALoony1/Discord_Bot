const { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js');
const createQuizLeaderboardEmbeds = require("../../utils/createQuizLeaderboardEmbeds");
const cron = require('node-cron');
const QuizQuestions = require('../../models/QuizQuestion');

module.exports = async (client) => {
    cron.schedule('11 1 * * 7', async function () {
        try {
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

            await targetChannel.send({
                embeds: [embed],
                components: [firstRow]
            });

            const fetchedQuestions = await QuizQuestions.find({
                asked: 'N',
            });
            const numberQuestions = new EmbedBuilder();
            numberQuestions.setColor(0x868686);
            numberQuestions.setTitle(`Anzahl der Fragen in der DB:`);
            numberQuestions.setDescription(`${fetchedQuestions.length}`);
            await targetChannel.send({ embeds: [numberQuestions] });
        } catch (error) {
            console.log(error);
        }
    });
};