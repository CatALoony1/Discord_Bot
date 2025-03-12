const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const Begruessung = require('../models/Begruessung');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-begruessung')
        .setDescription('Deaktiviert deine Begrüßung.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const targetBegruessung = await Begruessung.findOne({ authorId: interaction.user.id });
            if (targetBegruessung) {
                targetBegruessung.zugestimmt = 'N';
                targetBegruessung.save();
                interaction.editReply(`Begrüßung deaktiviert.`);
            } else {
                interaction.editReply(`Du hast keine Begrüßung eingetragen.`);
            }
        } catch (err) {
            console.log(err);
        }
    },
};