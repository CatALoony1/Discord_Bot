const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const getTenorGif = require('../utils/getTenorGif');
const getAIResult = require('../utils/getAIResult');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-gif')
        .setDescription('Sendet ein zufälliges GIF.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        const prompt = "Give me a random word.";
        const sysInstruction = "Only answer with one word and do not use punctuation.";
        const result = await getAIResult(prompt, sysInstruction);
        const suchwort = result.response.text();
        const regex = /^[A-Z\s]+$/i;
        if (!regex.test(suchwort)) {
            console.log(`ERROR, die KI hat mehr als ein Wort ausgespuckt! ${result.response.text()}`);
        }
        try {
            await getTenorGif(suchwort)
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
};