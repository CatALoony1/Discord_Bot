const { SlashCommandBuilder, InteractionContextType, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle } = require('discord.js');
const createShopEmbeds = require('../utils/createShopEmbeds.js');
const { co } = require('translatte/languages.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('spiele')
        .setDescription('Zeigt all deine Level-Bezogenen Daten.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('shop')
                .setDescription('Gibt Nutzer XP.')
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        if (!interaction.inGuild()) {
            interaction.reply('Hier ist doch kein Server!');
            return;
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const embed = await createShopEmbeds(0, interaction);
        const pageDownButton = new ButtonBuilder()
            .setEmoji('⬅️')
            .setLabel('Zurück')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`shopDown`);

        const pageUpButton = new ButtonBuilder()
            .setEmoji('➡️')
            .setLabel('Vorwärts')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`shopUp`);

        const buyButton = new ButtonBuilder()
            .setEmoji('🛒')
            .setLabel('Kaufen')
            .setStyle(ButtonStyle.Success)
            .setCustomId(`shopBuy`);

        const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton);
        const secondRow = new ActionRowBuilder().addComponents(buyButton);

        interaction.editReply({
            embeds: [embed],
            components: [firstRow, secondRow]
        });
    },
    options: {
        devOnly: false,
        deleted: false
    },
};