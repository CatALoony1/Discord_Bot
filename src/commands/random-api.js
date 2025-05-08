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
            randomNumber = 2;
            switch (randomNumber) {
                case 1:
                    await JokeAPI.getJokes()
                        .then((r) => r.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    if (data.type == 'twopart') {
                        const message = await interaction.editReply(`${data.setup}`);
                        var delay = 2000;
                        let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
                        await sleep(delay);
                        await message.reply(`${data.delivery}`);
                    } else {
                        await interaction.editReply(`${data.joke}`);
                    }
                    break;
                case 2:
                    await fetch('https://api.adviceslip.com/advice')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
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