const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-quiz')
        .setDescription('Füge eine Frage hinzu'),

    /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const mentionedUserId = interaction.user.id;
            const modal = new ModalBuilder()
                .setTitle('Trage eine Frage ein.')
                .setCustomId(`qaddbyadmin-${interaction.user.id}-${mentionedUserId}`);
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
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: true,
    },
};