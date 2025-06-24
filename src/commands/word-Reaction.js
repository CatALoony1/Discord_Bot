const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word-reaction')
        .setDescription('Reagiere mit Buchstaben auf eine Nachricht.')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('NachrichtID')
                .setMinLength(18)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('wort')
                .setDescription('Nur A-Z ! ?')
                .setMaxLength(10)
                .setRequired(true)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag} with value ${interaction.options.get('wort').value}`);
    },
    options: {
        devOnly: false,
        deleted: true
    },
};