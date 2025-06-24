const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('begruessung')
        .setDescription('Begrüßung')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Stelle deine Begrüßung ein.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Deaktiviert deine Begrüßung.')
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} ${interaction.options.getSubcommand()} was executed by user ${interaction.member.user.tag}`);
    },
    options: {
        devOnly: false,
        deleted: true
    },
};