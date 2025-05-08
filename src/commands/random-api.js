const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
require('dotenv').config();
const JokeAPI = require('sv443-joke-api');
const crypto = require('crypto');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generiereMarvelHash() {
    const ts = Date.now().toString();
    const hashString = ts + process.env.MARVEL_PRIVATE + process.env.MARVEL_PUBLIC;
    const hash = crypto.createHash('md5').update(hashString).digest('hex');
    return { ts, hash };
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
            let data = null;
            randomNumber = 12;
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
                        await message.reply(data.delivery);
                    } else {
                        await interaction.editReply(data.joke);
                    }
                    break;
                case 2:
                    await fetch('https://api.adviceslip.com/advice')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.slip.advice);
                    break;
                case 3:
                    await fetch('http://api.quotable.kurokeita.dev/api/quotes/random')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.quote.content + '\n~' + data.quote.author.name);
                    break;
                case 4:
                    await fetch('https://api.waifu.pics/sfw/waifu')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 5:
                    await fetch('https://api.waifu.pics/sfw/neko')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 6:
                    await fetch('https://api.waifu.pics/sfw/dance')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 7:
                    await fetch('https://api.waifu.pics/sfw/cry')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 8:
                    await fetch('https://api.waifu.pics/sfw/pat')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 9:
                    await fetch('https://api.waifu.pics/sfw/kiss')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 10:
                    await fetch('https://api.waifu.pics/sfw/kill')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                    break;
                case 11:
                    await fetch('https://api.waifu.pics/nsfw/waifu')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(`||${data.url}||`);
                    break;
                case 12:
                    const marvelParameter = generiereMarvelHash();
                    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${marvelParameter.ts}&apikey=${process.env.MARVEL_PUBLIC}&hash=${marvelParameter.hash}`;
                    console.log(apiUrl);
                    await fetch(apiUrl)
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
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