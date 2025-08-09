const { MessageFlags } = require('discord.js');
const QuizStats = require('../../sqliteModels/QuizStats');
const giveMoney = require('../../utils/giveMoney');
const { quizQuestionDAO, quizStatsDAO } = require('../../utils/initializeDB');

function isYesterday(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === yesterday.getTime();
}

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('quiz')) return;
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const [, rw, answer, id] = interaction.customId.split('_');
        const fetchedQuestion = await quizQuestionDAO.getById(id);
        if (fetchedQuestion) {
            const rightAnswerChar = fetchedQuestion.rightChar;
            if (fetchedQuestion.participants.includes(interaction.user.id)) {
                console.log('Quiz: tried to answer multiple times');
                await interaction.editReply('Du hast die Frage bereits beantwortet oder die Frage eingereicht.');
                return;
            } else {
                fetchedQuestion.participants.push(interaction.user.id);
            }
            if (answer == 'A') {
                fetchedQuestion.answerA += 1;
            } else if (answer == 'B') {
                fetchedQuestion.answerB += 1;
            } else if (answer == 'C') {
                fetchedQuestion.answerC += 1;
            } else {
                fetchedQuestion.answerD += 1;
            }
            await quizQuestionDAO.update(fetchedQuestion);
            const fetchedStats = await quizStatsDAO.getOneByUserAndGuild(interaction.user.id, interaction.guild.id);
            if (rw === 'right') {
                if (fetchedStats) {
                    fetchedStats.right += 1;
                    let xpToGive = 2000;
                    xpToGive = Math.ceil(xpToGive * (1 + ((fetchedStats.series * 10) / 100)));
                    await giveMoney(interaction.member, xpToGive);
                    if (isYesterday(fetchedStats.lastParticipation)) {
                        fetchedStats.series += 1;
                    } else {
                        fetchedStats.series = 1;
                    }
                    fetchedStats.lastParticipation = Date.now();
                    await quizStatsDAO.update(fetchedStats);
                } else {
                    const newStats = new QuizStats(undefined, interaction.guild.id, interaction.user.id, 1, 0, Date.now(), 1);
                    let xpToGive = 2000;
                    xpToGive = Math.ceil(xpToGive * 1.1);
                    await giveMoney(interaction.member, xpToGive);
                    await quizStatsDAO.insert(newStats);
                }
                await interaction.editReply(`Glückwunsch, Antwort ${answer} ist richtig!🥳`);
            } else if (rw === 'wrong') {
                if (fetchedStats) {
                    fetchedStats.wrong += 1;
                    fetchedStats.series = 0;
                    fetchedStats.lastParticipation = Date.now();
                    await quizStatsDAO.update(fetchedStats);
                } else {
                    const newStats = new QuizStats(undefined, interaction.guild.id, interaction.user.id, 0, 1, Date.now(), 1);
                    await quizStatsDAO.insert(newStats);
                }
                await interaction.editReply(`Antwort ${answer} ist leider nicht richtig! Die richtige Antwort ist ${rightAnswerChar}`);
            }
        } else {
            interaction.editReply(`Du kannst diese Frage nicht beantworten, da sie zu alt ist!`);
        }
    } catch (error) {
        console.log(error);
    }
};