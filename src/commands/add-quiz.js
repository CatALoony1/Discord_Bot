const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const Question = require('../models/QuizQuestion');
module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('add-quiz')
        .setDescription('Füge eine Frage hinzu')
        .addMentionableOption(option =>
            option.setName('nutzer')
                .setRequired(true)
                .setDescription('Vorschlagender Nutzer')
        ),

    /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const modal = new ModalBuilder()
                .setTitle('Schlage eine Frage vor.')
                .setCustomId(`qaddbyadmin-${interaction.user.id}`);
            const frageInput = new TextInputBuilder()
                .setCustomId('qaddbyadmin-frage')
                .setLabel('Frage:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(300);
            const richtigInput = new TextInputBuilder()
                .setCustomId('qaddbyadmin-richtig')
                .setLabel('Richtige Antwort:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(100);
            const falsch1Input = new TextInputBuilder()
                .setCustomId('qaddbyadmin-falsch1')
                .setLabel('Falsche Antwort 1:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(100);
            const falsch2Input = new TextInputBuilder()
                .setCustomId('qaddbyadmin-falsch2')
                .setLabel('Falsche Antwort 2:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(100);
            const falsch3Input = new TextInputBuilder()
                .setCustomId('qaddbyadmin-falsch3')
                .setLabel('Falsche Antwort 3:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(100);
            const firstActionRow = new ActionRowBuilder().addComponents(frageInput);
            const secondActionRow = new ActionRowBuilder().addComponents(richtigInput);
            const thirdctionRow = new ActionRowBuilder().addComponents(falsch1Input);
            const fourthActionRow = new ActionRowBuilder().addComponents(falsch2Input);
            const fifthActionRow = new ActionRowBuilder().addComponents(falsch3Input);
            modal.addComponents(firstActionRow, secondActionRow, thirdctionRow, fourthActionRow, fifthActionRow);
            await interaction.showModal(modal);
            const filter = (i) => i.customId === `qaddbyadmin-${interaction.user.id}`;
            const modalInteraction = await interaction.awaitModalSubmit({
                filter,
                time: 1000 * 60 * 3 //1sec * 60 *3 = 3min
            }).catch((error) => console.log(error));
            await modalInteraction.deferReply({ ephemeral: true })
            const frage = modalInteraction.fields.getTextInputValue('qaddbyadmin-frage');
            const richtig = modalInteraction.fields.getTextInputValue('qaddbyadmin-richtig');
            const falsch1 = modalInteraction.fields.getTextInputValue('qaddbyadmin-falsch1');
            const falsch2 = modalInteraction.fields.getTextInputValue('qaddbyadmin-falsch2');
            const falsch3 = modalInteraction.fields.getTextInputValue('qaddbyadmin-falsch3');
            const mentionedUserId = interaction.options.get('nutzer')?.value;
            const wrong = `${falsch1}/${falsch2}/${falsch3}`
            const participants = [];
            participants[0] = mentionedUserId;
            const newQuestion = new Question({
                question: frage,
                right: richtig,
                wrong: wrong,
                participants: participants
            });
            await newQuestion.save();
            modalInteraction.editReply('Frage eingetragen!');
        } catch (err) {
            console.log(err);
        }
    },
};