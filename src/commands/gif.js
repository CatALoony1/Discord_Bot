const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
require('dotenv').config();
const fetch = require('node-fetch');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sendet ein zufälliges gif zu einem Begriff.')
        .addStringOption(option =>
            option.setName('suchwort')
                .setDescription('Suchwort')
                .setMinLength(1)
                .setRequired(true)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        const suchwort = interaction.options.get('suchwort').value;
        const regex = /^[A-Z]+$/i;
        if (!regex.test(suchwort)) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await interaction.editReply('Das übergebene Wort enthält Zeichen die nicht zugelassen sind.');
            return;
        }
        try {
            var apikey = process.env.TENOR_API;
            getTenorGif(suchwort, apikey)
                .then((gifUrl) => {
                    interaction.reply(gifUrl);
                })
                .catch((error) => {
                    console.error('ERROR:', error);
                });

        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: true,
    },
};

async function getTenorGif(searchTerm, apiKey) {
    const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=1&random=true`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const gifUrl = data.results[0].media_formats.gif.url;
            return gifUrl;
        } else {
            return 'Kein GIF gefunden.';
        }
    } catch (error) {
        console.error('Fehler beim Abrufen des GIFs:', error);
        return 'Fehler beim Abrufen des GIFs.';
    }
}
