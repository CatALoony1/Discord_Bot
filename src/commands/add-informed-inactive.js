const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Config = require('../models/Config');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-informed-inactive')
        .setDescription('Setzt User beim Inaktivitäts-Check aus.')
        .addMentionableOption(option =>
            option.setName('nutzer')
                .setDescription('Nutzer')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        if (!interaction.inGuild()) {
            interaction.editReply('Hier ist doch kein Server!');
            return;
        }
        const targetUserId = interaction.options.get('nutzer').value;
        if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
            interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
            return;
        }
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        const config = await Config.findOne({
            away: 'away',
        });
        if (config.value.includes(targetUserObj.user.tag)) {
            await interaction.editReply(`Der User ${targetUserObj.user.tag} ist bereits einetragen.`);
        } else {
            if (config.value.length >= 1) {
                config.value = `${config.value},${targetUserObj.user.tag}`;
            } else {
                config.value = `${targetUserObj.user.tag}`;
            }
            await config.save();
            await interaction.editReply(`Der User ${targetUserObj.user.tag} wurde einetragen.`);
        }
    },
};