const Discord = require("discord.js");
const Question = require('../../sqliteModels/QuizQuestion');
const giveMoney = require('../../utils/giveMoney');
const { quizQuestionDAO } = require('../../utils/daos');

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId.includes(`quizadd-${interaction.user.id}`)) {
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });
        const frage = interaction.fields.getTextInputValue('quizadd-frage');
        const richtig = interaction.fields.getTextInputValue('quizadd-richtig');
        const falsch1 = interaction.fields.getTextInputValue('quizadd-falsch1');
        const falsch2 = interaction.fields.getTextInputValue('quizadd-falsch2');
        const falsch3 = interaction.fields.getTextInputValue('quizadd-falsch3');
        const [, , mentionedUserId] = interaction.customId.split('-');
        const wrong = `${falsch1}/${falsch2}/${falsch3}`;
        const participants = [];
        participants[0] = mentionedUserId;
        const newQuestion = new Question();
        newQuestion.setQuestion(frage);
        newQuestion.setRight(richtig);
        newQuestion.setWrong(wrong);
        newQuestion.setParticipants(participants);
        newQuestion.setGuildId(process.env.GUILD_ID);
        await quizQuestionDAO.insert(newQuestion);
        const targetUserObj = await interaction.guild.members.fetch(mentionedUserId);
        var moneyToGive = 2000;
        await giveMoney(targetUserObj, moneyToGive, true);
        interaction.editReply('Frage eingetragen!');
    }
    return;
};