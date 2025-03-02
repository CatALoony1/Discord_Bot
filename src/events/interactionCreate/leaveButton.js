const { ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || interaction.customId != 'whyleave') return;
    console.log(`Button ${interaction.commandName} was executed by user ${interaction.user.tag}`);
    try {
        const modal = new ModalBuilder()
            .setTitle('Warum hast du uns verlassen?')
            .setCustomId(`whyleave-${interaction.user.tag}`);
        const textInput = new TextInputBuilder()
            .setCustomId('whyleave-input')
            .setLabel('Warum nur?')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);
        const actionRow = new ActionRowBuilder().addComponents(textInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    } catch (error) {
        console.log(error);
    }
};