const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Config = require('../models/Config');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-informed-inactive')
        .setDescription('Aktiviere User beim Inaktivitäts-Check.')
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
            key: 'away',
        });
        if (config.value.includes(targetUserObj.user.tag)) {
            let away = config.value.split(',');
            console.log(away);
            console.log(away.indexOf(targetUserObj.user.tag));
            away = away.splice(away.indexOf(targetUserObj.user.tag), 1);
            console.log(away);
            config.value = away.toString();
            await config.save();
            await interaction.editReply(`Der User ${targetUserObj.user.tag} wurde entfernt.`);
        } else {
            await interaction.editReply(`Der User ${targetUserObj.user.tag} ist gar nicht einetragen.`);
        }
    },
};