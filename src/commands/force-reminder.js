const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const Bump = require("../sqliteModels/Bump");
require('dotenv').config();
const { getDaos } = require('../utils/daos');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('force-reminder')
        .setDescription('Erstellt den Bump Reminder')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        try {
            const { bumpDAO } = getDaos();
            const bumpEntry = await bumpDAO.getOneByGuild(interaction.guild.id);
            if (bumpEntry) {
                bumpEntry.endTime = Date.now() + 7200000;
                bumpEntry.reminded = 'N';
                await bumpDAO.update(bumpEntry);
                await interaction.editReply(`Bump Reminder erstellt!`);
            } else {
                const newBump = new Bump();
                newBump.guildId = interaction.guild.id;
                newBump.endTime = Date.now() + 7200000;
                await bumpDAO.insert(newBump);
                await interaction.editReply(`Bump Reminder erstellt!`);
            }
        } catch (error) {
            interaction.editReply('Fehler bei erstellen des Bump Reminders.');
            console.log(error);
        }
    },
};