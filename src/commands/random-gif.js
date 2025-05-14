
const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const getTenorGif = require('../utils/getTenorGif');
const wordList = require('../utils/wordList');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-gif')
        .setDescription('Sendet ein zufälliges GIF.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        await interaction.deferReply();
        const suchwort = wordList[getRandom(0, wordList.length - 1)];
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
    options: {
        devOnly: false,
        deleted: true,
    },
};