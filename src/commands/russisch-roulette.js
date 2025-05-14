const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const removeXP = require('../utils/removeXP');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('russisch-roulette')
        .setDescription('Lasse jemanden russisch roulette spielen.')
        .addMentionableOption(option =>
            option.setName('nutzer')
                .setDescription('Nutzer der spielen soll')
                .setRequired(true)
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
        const mentionedUserId = interaction.options.get('nutzer')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
            interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
            return;
        }
        const zufallsZahl = Math.floor(Math.random() * 6) + 1;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        if (zufallsZahl == 6) {
            await removeXP(targetUserObj, 1000, interaction.channel);
            await interaction.editReply(`${targetUserObj} hat beim Russisch Roulette verloren und hat 1000XP verloren!`);
        } else {
            await interaction.editReply(`${targetUserObj} hatte Glück und hat überlebt!`);
        }
    },
    options: {
        devOnly: true,
        deleted: true,
    },
};