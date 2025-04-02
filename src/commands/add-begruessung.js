const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-begruessung')
        .setDescription('Stelle deine Begrüßung ein.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const modal = new ModalBuilder()
                .setTitle('Deine Begrüßung:')
                .setCustomId(`begruessung-${interaction.user.id}`);
            const textInput = new TextInputBuilder()
                .setCustomId('begruessung-text')
                .setLabel('Begrüßung:')
                .setPlaceholder('Placeholders:\n<me> - du\n<new> - der/die neue\n <#CHANNELID> - CHANNELID ersetzen')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(500);
            const firstActionRow = new ActionRowBuilder().addComponents(textInput);
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        } catch (err) {
            console.log(err);
        }
    },
};