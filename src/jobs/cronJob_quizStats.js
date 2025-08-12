const { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js');
const createQuizLeaderboardEmbeds = require("../utils/createQuizLeaderboardEmbeds");
const cron = require('node-cron');
const { getDaos } = require('../utils/daos');

let quizStatsJob = null;

function startJob(client) {
    if (quizStatsJob) {
        console.log('QuizStats-Job is already running.');
        return;
    }
    quizStatsJob = cron.schedule('11 1 * * 7', async function () {
        await jobFunction(client).catch((error) => {
            console.log(error);
        });
    });
    console.log('QuizStats-Job started.');
}

function stopJob() {
    if (quizStatsJob) {
        quizStatsJob.stop();
        quizStatsJob = null;
        console.log('QuizStats-Job stopped.');
    } else {
        console.log('QuizStats-Job is not running.');
    }
}

function isRunning() {
    return quizStatsJob !== null;
}

async function jobFunction(client) {
    try {
        const { quizQuestionDAO } = getDaos();
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

        const unaskedQuestions = await quizQuestionDAO.getCountUnasked(process.env.GUILD_ID);
        if (unaskedQuestions) {
            const numberQuestions = new EmbedBuilder();
            numberQuestions.setColor(0x868686);
            numberQuestions.setTitle(`Anzahl der Fragen in der DB:`);
            numberQuestions.setDescription(`${unaskedQuestions}`);
            await targetChannel.send({ embeds: [numberQuestions] });
        }
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