const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const removeXP = require('../utils/removeXP');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removexp')
        .setDescription('Zieht XP von einem Nutzer ab.')
        .addMentionableOption(option =>
            option.setName('nutzer')
                .setDescription('Nutzer der XP verlieren soll')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('xpmenge')
                .setDescription('Die Menge an XP die dem Nutzer abgezogen werden soll.')
                .setRequired(true)
                .setMaxValue(3000)
                .setMinValue(1)
        )
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Der Grund für den Abzug')
                .setRequired(true)
                .setMinLength(1)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        if (!interaction.inGuild()) {
            interaction.reply('Hier ist doch kein Server!');
            return;
        }
        await interaction.deferReply();
        const targetUserId = interaction.options.get('nutzer').value;
        if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
            interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
            return;
        }
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        var xpToRemove = interaction.options.get('xpmenge').value;
        const reason = interaction.options.get('grund').value;
        xpToRemove = await removeXP(targetUserObj, xpToRemove, interaction.channel);
        await interaction.editReply(`Nutzer ${targetUserObj} wurden ${xpToRemove} XP abgezogen!\nGrund: ${reason}`);
    },
};