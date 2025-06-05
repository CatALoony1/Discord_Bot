const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const handleSpieleCommands = require('../utils/handleSpieleCommands.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spiele')
        .setDescription('Zeigt all deine Level-Bezogenen Daten.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('shop')
                .setDescription('Gibt Nutzer XP.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('use_item')
                .setDescription('Benutze ein Item.')
                .addIntegerOption(option =>
                    option.setName('item_id')
                        .setDescription('Die ID des Items, das du benutzen möchtest.')
                        .setRequired(true)
                )
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        if (!interaction.inGuild()) {
            interaction.reply('Hier ist doch kein Server!');
            return;
        }
        const subcommand = interaction.options.getSubcommand();
        if (subcommand == 'shop') {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            return await handleSpieleCommands.handleShop(interaction);
        } else if (subcommand == 'use_item') {
            return await handleSpieleCommands.handleUseItem(interaction);
        }

    },
    options: {
        devOnly: false,
        deleted: false
    },
};