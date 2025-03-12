const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-begruessung')
        .setDescription('Stelle deine Begrüßung ein.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const modal = new ModalBuilder()
                .setTitle('Deine Begrüßung:')
                .setCustomId(`begruessung-${interaction.user.id}`);
            const textInput = new TextInputBuilder()
                .setCustomId('begruessung-text')
                .setLabel('Frage:')
                .setPlaceholder('Placeholders:\n<me> - mention yourself\n<bot> - mention Captain Iglo\n<new> - mention new Member\n<server> - mention the server\n\nUm einen Channel zu erwähnen bitte <#challenID> (channelID durch die ID des channels ersetzen)')
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