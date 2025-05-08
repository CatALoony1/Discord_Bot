const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const JokeAPI = require('sv443-joke-api');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomapi')
        .setDescription('Rufe eine zufällige API auf.')
        .addIntegerOption(option =>
            option.setName('zahl')
              .setDescription('Trag ein wenn du magst.')
              .setRequired(false)
          )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const zahl = interaction.options.get('zahl')?.value || -1;
            const fetch = await import('node-fetch').then(module => module.default);
            await interaction.deferReply({ ephemeral: true });
            let randomNumber = getRandom(1, 100);
            let data = null;
            randomNumber = zahl;
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
                    let heroId = getRandom(1, 731);
                    if (zahl > 0 && zahl <= 731) {
                        heroId = zahl;
                    }
                    const apiUrl = `https://superheroapi.com/api/${process.env.HERO_API}/${heroId}`;
                    console.log(apiUrl);
                    await fetch(apiUrl)
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    const hero = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(data.name)
                        .setThumbnail(data.image.url)
                        .addFields(
                            { name: 'ID', value: data.id },
                            { name: 'Verlag', value: data.biography.publisher, inline: true },
                            { name: 'Gesinnung', value: data.biography.alignment, inline: true },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Intelligenz', value: data.powerstats.intelligence !== 'null' ? data.powerstats.intelligence : '-', inline: true },
                            { name: 'Stärke', value: data.powerstats.strength !== 'null' ? data.powerstats.strength : '-', inline: true },
                            { name: 'Geschwindigkeit', value: data.powerstats.speed !== 'null' ? data.powerstats.speed : '-', inline: true },
                            { name: 'Haltbarkeit', value: data.powerstats.durability !== 'null' ? data.powerstats.durability : '-', inline: true },
                            { name: 'Kraft', value: data.powerstats.power !== 'null' ? data.powerstats.power : '-', inline: true },
                            { name: 'Kampf', value: data.powerstats.combat !== 'null' ? data.powerstats.combat : '-', inline: true },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Vollständiger Name', value: data.biography['full-name'] || '-', inline: true },
                            { name: 'Alter Egos', value: data.biography['alter-egos'] || '-', inline: true },
                            { name: 'Alias(se)', value: data.biography.aliases.join(', ') || '-', inline: true },
                            { name: 'Geburtsort', value: data.biography['place-of-birth'] || '-', inline: true },
                            { name: 'Erster Auftritt', value: data.biography['first-appearance'] || '-', inline: true },
                            { name: 'Geschlecht', value: data.appearance.gender || '-', inline: true },
                            { name: 'Rasse', value: data.appearance.race || '-', inline: true },
                            { name: 'Größe', value: data.appearance.height.join(' / ') || '-', inline: true },
                            { name: 'Gewicht', value: data.appearance.weight.join(' / ') || '-', inline: true },
                            { name: 'Augenfarbe', value: data.appearance['eye-color'] || '-', inline: true },
                            { name: 'Haarfarbe', value: data.appearance['hair-color'] || '-', inline: true },
                            { name: 'Beruf', value: data.work.occupation || '-', inline: true },
                            { name: 'Basis', value: data.work.base || '-', inline: true },
                            { name: 'Gruppenzugehörigkeit', value: data.connections['group-affiliation'] || '-', inline: true },
                            { name: 'Verwandte', value: data.connections.relatives || '-', inline: true }
                        )
                        .setFooter({ text: 'Daten von SuperHeroDB', iconURL: 'https://www.superherodb.com/images/logo.svg' });
                    await interaction.editReply({ embeds: [hero] });
                    break;
                case 13:
                    await fetch('https://api.chucknorris.io/jokes/random')
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.value);
                    break;
                case 14:
                    if (zahl !== -1) {
                        await fetch(`http://numbersapi.com/${zahl}/trivia`)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                    } else {
                        await fetch('http://numbersapi.com/random/trivia')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                    }
                    //await interaction.editReply(data.value);
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
        deleted: false
    },
};