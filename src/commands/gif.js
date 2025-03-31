const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const getTenorGif = require('../utils/getTenorGif');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sendet ein zufälliges GIF zu einem Begriff.')
        .addStringOption(option =>
            option.setName('suchwort')
                .setDescription('Suchwort')
                .setMinLength(1)
                .setRequired(true)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        await interaction.deferReply();
        const suchwort = interaction.options.get('suchwort').value;
        const regex = /^[\u0041-\u005A\u00C4\u00D6\u00DC\u00DF\s]+$/i; //A-Z, ÄÖÜ, ß
        if (!regex.test(suchwort)) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await interaction.editReply('Das übergebene Wort enthält Zeichen die nicht zugelassen sind.');
            return;
        }
        try {
            await getTenorGif(suchwort)
                .then((gifUrl) => {
                    interaction.editReply(gifUrl);
                })
                .catch((error) => {
                    console.error('ERROR:', error);
                });
        } catch (error) {
            console.log(error);
        }
    },
};