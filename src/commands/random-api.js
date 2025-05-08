const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
require('dotenv').config();
const JokeAPI = require('sv443-joke-api');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-api')
        .setDescription('Rufe eine zufällige API auf.')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const fetch = await import('node-fetch').then(module => module.default);
            await interaction.deferReply({ ephemeral: true });
            let randomNumber = getRandom(1, 100);
            let response = null;
            let data = null;
            randomNumber = 1;
            switch (randomNumber) {
                case 1:
                    await JokeAPI.getJokes()
                        .then((res) => res.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    break;
                case 2:
                    await interaction.editReply('Zufällige API-Antwort: 2');
                    break;
                case 3:
                    await interaction.editReply('Zufällige API-Antwort: 3');
                    break;
                default:
                    await interaction.editReply('Zufällige API-Antwort: Default');
            }
            //await interaction.editReply(`Zufällige API-Antwort:\n${JSON.stringify(data)}`);
            console.log(data);
            await interaction.editReply('Done!');
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: true,
    },
};