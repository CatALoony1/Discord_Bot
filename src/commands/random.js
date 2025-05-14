const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const JokeAPI = require('sv443-joke-api');
const getTenorGif = require('../utils/getTenorGif');
const wordList = require('../utils/wordList');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Nutzt den Zufall')
        .addSubcommand(subcommand =>
            subcommand
                .setName('api')
                .setDescription('Rufe eine zufällige API auf.')
                .addIntegerOption(option =>
                    option.setName('zahl')
                        .setDescription('Trag was ein wenn du magst.')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('gif')
                .setDescription('Sendet ein zufälliges GIF.')
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const subcommand = interaction.options.getSubcommand();
            await interaction.deferReply();
            if (subcommand === 'gif') {
                const suchwort = wordList[getRandom(0, wordList.length - 1)];
                await getTenorGif(suchwort)
                    .then((gifUrl) => {
                        interaction.editReply(gifUrl);
                    })
                    .catch((error) => {
                        console.error('ERROR:', error);
                    });
            } else if (subcommand === 'api') {
                const zahl = interaction.options.get('zahl')?.value || -1;
                const fetch = await import('node-fetch').then(module => module.default);
                let randomNumber = getRandom(1, 35);
                let data = null;
                let apiUrl = null;
                const delay = 2000;
                let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
                if (interaction.user.id == process.env.ADMIN_ID && String(zahl).startsWith('99')) {
                    randomNumber = Number(String(zahl).substring(2));
                }
                switch (randomNumber) {
                    case 1: {
                        await JokeAPI.getJokes()
                            .then((r) => r.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        if (data.type == 'twopart') {
                            const message = await interaction.editReply(`${data.setup}`);
                            await sleep(delay);
                            await message.reply(data.delivery);
                        } else {
                            await interaction.editReply(data.joke);
                        }
                        break;
                    }
                    case 2: {
                        await fetch('https://api.adviceslip.com/advice')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.slip.advice);
                        break;
                    }
                    case 3: {
                        await fetch('http://api.quotable.kurokeita.dev/api/quotes/random')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.quote.content + '\n~' + data.quote.author.name);
                        break;
                    }
                    case 4: {
                        apiUrl = 'https://api.jikan.moe/v4/random/anime';
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const anime = data.data;
                        const animeEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(anime.title)
                            .setURL(anime.url)
                            .setThumbnail(anime.images.jpg.image_url)
                            .addFields(
                                { name: 'Typ', value: anime.type || '-', inline: true },
                                { name: 'Status', value: anime.status || '-', inline: true },
                                { name: 'Episoden', value: anime.episodes ? anime.episodes.toString() : '-', inline: true },
                                { name: 'Bewertung', value: anime.score ? anime.score.toString() : '-', inline: true },
                                { name: 'Genres', value: anime.genres.map(genre => genre.name).join(', ') || '-', inline: true },
                                { name: 'Erstausstrahlung', value: anime.aired.string || '-', inline: true },
                                { name: 'Studio', value: anime.studios.map(studio => studio.name).join(', ') || '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von Jikan' });
                        await interaction.editReply({ embeds: [animeEmbed] });
                        break;
                    }
                    case 5: {
                        let page = getRandom(1, 4);
                        if (zahl > 0 && zahl <= 4) {
                            page = zahl;
                        }
                        apiUrl = `https://api.potterdb.com/v1/spells?page[number]=${page}`;
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const randomIndex = getRandom(0, data.data.length - 1);
                        const spell = data.data[randomIndex];
                        const spellEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(spell.attributes.name)
                            .setThumbnail(spell.attributes.image)
                            .addFields(
                                { name: 'Zauberart', value: spell.attributes.category || '-', inline: true },
                                { name: 'Effekt', value: spell.attributes.effect || '-', inline: true },
                                { name: 'Spruch', value: spell.attributes.incantation || '-', inline: true },
                                { name: 'Licht', value: spell.attributes.light || '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von PotterDB' });
                        await interaction.editReply({ embeds: [spellEmbed] });
                        break;
                    }
                    case 6: {
                        let page = getRandom(1, 51);
                        if (zahl > 0 && zahl <= 51) {
                            page = zahl;
                        }
                        apiUrl = `https://api.potterdb.com/v1/characters?page[number]=${page}`;
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const randomIndex = getRandom(0, data.data.length - 1);
                        const character = data.data[randomIndex];
                        const characterEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(character.attributes.name)
                            .setThumbnail(character.attributes.image)
                            .addFields(
                                { name: 'Haus', value: character.attributes.house || '-', inline: true },
                                { name: 'Geburtsdatum', value: character.attributes.born || '-', inline: true },
                                { name: 'Blutstatus', value: character.attributes.blood_status || '-', inline: true },
                                { name: 'Todestag', value: character.attributes.died || '-', inline: true },
                                { name: 'Geschlecht', value: character.attributes.gender || '-', inline: true },
                                { name: 'Patronus', value: character.attributes.patronus || '-', inline: true },
                                { name: 'Zauberstab', value: character.attributes.wands[0] || '-', inline: true },
                                { name: 'Spezies', value: character.attributes.species || '-', inline: true },
                                { name: 'Job', value: character.attributes.jobs[0] || '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von PotterDB' });
                        await interaction.editReply({ embeds: [characterEmbed] });
                        break;
                    }
                    case 7: {
                        let page = getRandom(1, 25);
                        if (zahl > 0 && zahl <= 25) {
                            page = zahl;
                        }
                        apiUrl = `https://api.fbi.gov/wanted/v1/list?page=${page}`;
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const randomIndex = getRandom(0, data.items.length - 1);
                        const wantedPerson = data.items[randomIndex];
                        const wantedEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(wantedPerson.title)
                            .setURL(wantedPerson.url)
                            .setThumbnail(wantedPerson.images[0].original)
                            .addFields(
                                { name: 'Beschreibung', value: wantedPerson.description || '-', inline: true },
                                { name: 'Veröffentlichungsdatum', value: wantedPerson.publish_date || '-', inline: true },
                                { name: 'Belohnung', value: wantedPerson.reward_text || '-', inline: true },
                                { name: 'Status', value: wantedPerson.status || '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von FBI.gov' });
                        await interaction.editReply({ embeds: [wantedEmbed] });
                        break;
                    }
                    case 8: {
                        let moveId = getRandom(1, 919);
                        if (zahl > 0 && zahl <= 919) {
                            moveId = zahl;
                        }
                        apiUrl = `https://pokeapi.co/api/v2/move/${moveId}`;
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const availability = data.learned_by_pokemon
                            .slice(0, 5)
                            .map(pokemon => pokemon.name)
                            .join(', ') || '-';
                        const move = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(data.name.charAt(0).toUpperCase() + data.name.slice(1))
                            .addFields(
                                { name: 'ID', value: data.id.toString(), inline: true },
                                { name: 'Name', value: data.name.charAt(0).toUpperCase() + data.name.slice(1), inline: true },
                                { name: 'Name-De', value: data.names[4].name.charAt(0).toUpperCase() + data.names[4].name.slice(1), inline: true },
                                { name: 'Kategorie', value: data.damage_class.name.charAt(0).toUpperCase() + data.damage_class.name.slice(1), inline: true },
                                { name: 'Typ', value: data.type.name.charAt(0).toUpperCase() + data.type.name.slice(1), inline: true },
                                { name: 'Aktion', value: data.effect_entries[0].effect || '-', inline: true },
                                { name: 'Flavour Text', value: data.flavor_text_entries[0].text || '-', inline: true },
                                { name: 'Verfügbarkeit', value: availability, inline: true },
                                { name: 'PP', value: data.pp.toString(), inline: true },
                                { name: 'Power', value: data.power ? data.power.toString() : '-', inline: true },
                                { name: 'Accuracy', value: data.accuracy ? data.accuracy.toString() : '-', inline: true },
                                { name: 'Priority', value: data.priority ? data.priority.toString() : '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von PokeAPI' });
                        await interaction.editReply({ embeds: [move] });
                        break;
                    }
                    case 9: {
                        let itemId = getRandom(1, 2229);
                        if (zahl > 0 && zahl <= 2229) {
                            itemId = zahl;
                        }
                        apiUrl = `https://pokeapi.co/api/v2/item/${itemId}`;
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const item = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(data.name.charAt(0).toUpperCase() + data.name.slice(1))
                            .setThumbnail(data.sprites.default)
                            .addFields(
                                { name: 'ID', value: data.id.toString(), inline: true },
                                { name: 'Kategorie', value: data.category.name.charAt(0).toUpperCase() + data.category.name.slice(1), inline: true },
                                { name: 'Verkaufspreis', value: data.cost.toString(), inline: true },
                                { name: 'Verfügbarkeit', value: data.game_indices.map(game => game.generation.name).join(', '), inline: true },
                                { name: 'Beschreibung', value: data.effect_entries[0].effect || '-', inline: true },
                                { name: 'Flavour Text', value: data.flavor_text_entries[0].text || '-', inline: true },
                                { name: 'Name', value: data.name || '-', inline: true },
                                { name: 'Name', value: data.names[0].language.name || '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von PokeAPI' });
                        await interaction.editReply({ embeds: [item] });
                        break;
                    }
                    case 10: {
                        await fetch(`https://api.spoonacular.com/food/trivia/random?apiKey=${process.env.SPOONACULAR_API}`)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.text);
                        break;
                    }
                    case 11: {
                        await fetch(`https://api.spoonacular.com/food/jokes/random?apiKey=${process.env.SPOONACULAR_API}`)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.text);
                        break;
                    }
                    case 12: {
                        let heroId = getRandom(1, 731);
                        if (zahl > 0 && zahl <= 731) {
                            heroId = zahl;
                        }
                        apiUrl = `https://superheroapi.com/api/${process.env.HERO_API}/${heroId}`;
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
                    }
                    case 13: {
                        await fetch('https://api.chucknorris.io/jokes/random')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.value);
                        break;
                    }
                    case 14: {
                        if (zahl !== -1) {
                            apiUrl = `http://numbersapi.com/${zahl}/trivia`;
                        } else {
                            apiUrl = 'http://numbersapi.com/random/trivia';
                        }
                        await fetch(apiUrl)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then((mydata) => {
                                data = mydata;
                            })
                            .catch((error) => {
                                console.error('Fehler beim Abrufen der Trivia:', error);
                            });
                        await interaction.editReply(data);
                        break;
                    }
                    case 15: {
                        if (zahl !== -1) {
                            apiUrl = `http://numbersapi.com/${zahl}/math`;
                        } else {
                            apiUrl = 'http://numbersapi.com/random/math';
                        }
                        await fetch(apiUrl)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then((mydata) => {
                                data = mydata;
                            })
                            .catch((error) => {
                                console.error('Fehler beim Abrufen der Trivia:', error);
                            });
                        await interaction.editReply(data);
                        break;
                    }
                    case 16: {
                        await fetch('http://numbersapi.com/random/year')
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then((mydata) => {
                                data = mydata;
                            })
                            .catch((error) => {
                                console.error('Fehler beim Abrufen der Trivia:', error);
                            });
                        await interaction.editReply(data);
                        break;
                    }
                    case 17: {
                        await fetch('http://numbersapi.com/random/date')
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then((mydata) => {
                                data = mydata;
                            })
                            .catch((error) => {
                                console.error('Fehler beim Abrufen der Trivia:', error);
                            });
                        await interaction.editReply(data);
                        break;
                    }
                    case 18: {
                        await fetch(`https://api.agify.io?name=${interaction.user.displayName}`)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(`Du bist: ${data.age} Jahre alt.`);
                        break;
                    }
                    case 19: {
                        await fetch(`http://thecocktaildb.com/api/json/v1/1/random.php`)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const drink = data.drinks[0];
                        let output = `**${drink.strDrink}**\n\n`;
                        output += `Kategorie: ${drink.strCategory}\n`;
                        output += `Alkoholisch: ${drink.strAlcoholic}\n`;
                        output += `Glas: ${drink.strGlass}\n\n`;
                        output += `**Zutaten:**\n`;
                        for (let i = 1; i <= 15; i++) {
                            if (drink[`strIngredient${i}`]) {
                                output += `- ${drink[`strMeasure${i}`] || ''} ${drink[`strIngredient${i}`]}\n`;
                            }
                        }
                        output += `\n**Zubereitung:** ${drink.strInstructionsDE || drink.strInstructions}\n`;
                        output += `\n${drink.strDrinkThumb}`;
                        await interaction.editReply(output);
                        break;
                    }
                    case 20: {
                        await fetch(`https://api.thecatapi.com/v1/images/search?size=full&limit=1`, {
                            headers: {
                                'x-api-key': process.env.CAT_API
                            }
                        })
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data[0].url);
                        break;
                    }
                    case 21: {
                        await fetch(`https://api.thedogapi.com/v1/images/search?size=full&limit=1`, {
                            headers: {
                                'x-api-key': process.env.DOG_API
                            }
                        })
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data[0].url);
                        break;
                    }
                    case 22:
                        {
                            await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=1')
                                .then((response) => response.json())
                                .then((mydata) => {
                                    data = mydata;
                                });
                            await interaction.editReply(data.cards[0].image);
                            break;
                        }
                    case 23: {
                        await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.SPOONACULAR_API}`)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const recipe = data.recipes[0];
                        if (recipe) {
                            const recipeEmbed = new EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle(recipe.title)
                                .setURL(recipe.sourceUrl)
                                .setImage(recipe.image)
                                .addFields(
                                    { name: 'Zubereitungszeit', value: `${recipe.readyInMinutes} Minuten`, inline: true },
                                    { name: 'Portionen', value: `${recipe.servings}`, inline: true },
                                    { name: 'Vegetarisch', value: recipe.vegetarian ? 'Ja' : 'Nein', inline: true },
                                    { name: 'Vegan', value: recipe.vegan ? 'Ja' : 'Nein', inline: true },
                                    { name: 'Glutenfrei', value: recipe.glutenFree ? 'Ja' : 'Nein', inline: true },
                                    { name: 'Dairyfrei', value: recipe.dairyFree ? 'Ja' : 'Nein', inline: true },
                                    { name: 'Preis pro Portion', value: `$${recipe.pricePerServing.toFixed(2)}`, inline: true },
                                    { name: 'Spoonacular Score', value: `${recipe.spoonacularScore.toFixed(2)}`, inline: true },
                                    {
                                        name: 'Zusammenfassung',
                                        value: recipe.summary.substring(0, 500) + (recipe.summary.length > 500 ? '...' : '')
                                    },
                                )
                                .setFooter({ text: `Quelle: ${recipe.sourceName}` });
                            await interaction.editReply({ embeds: [recipeEmbed] });
                        } else {
                            await interaction.editReply('Es wurde kein Rezept gefunden.');
                        }
                        break;
                    }
                    case 24: {
                        let pokemonId = getRandom(1, 1025);
                        if (zahl > 0 && zahl <= 1025) {
                            pokemonId = zahl;
                        }
                        apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
                        console.log(apiUrl);
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const pokemon = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(data.name.charAt(0).toUpperCase() + data.name.slice(1))
                            .setThumbnail(data.sprites.front_default)
                            .addFields(
                                { name: 'ID', value: data.id.toString(), inline: true },
                                { name: 'Typ', value: data.types.map(type => type.type.name).join(', '), inline: true },
                                { name: 'Gewicht', value: (data.weight / 10).toString() + ' kg', inline: true },
                                { name: 'Größe', value: (data.height / 10).toString() + ' m', inline: true },
                                { name: '\u200B', value: '\u200B' },
                                { name: 'Basiswerte', value: `HP: ${data.stats[0].base_stat}\nAttacke: ${data.stats[1].base_stat}\nVerteidigung: ${data.stats[2].base_stat}\nAngriffsspezialisiert: ${data.stats[3].base_stat}\nVerteidigungsspezialisiert: ${data.stats[4].base_stat}\nInitiative: ${data.stats[5].base_stat}` }
                            )
                            .setFooter({ text: 'Daten von PokeAPI' });
                        await interaction.editReply({ embeds: [pokemon] });
                        break;
                    }
                    case 25: {
                        await fetch('https://official-joke-api.appspot.com/random_joke')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const message = await interaction.editReply(`${data.setup}`);
                        await sleep(delay);
                        await message.reply(data.punchline);
                        break;
                    }
                    case 26: {
                        await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=de')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.text);
                        break;
                    }
                    case 27: {
                        await fetch('https://geek-jokes.sameerkumar.website/api?format=json')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.joke);
                        break;
                    }
                    case 28: {
                        await fetch('https://meowfacts.herokuapp.com/')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.data[0]);
                        break;
                    }
                    case 29: {
                        let page = getRandom(1, 149);
                        if (zahl > 0 && zahl <= 149) {
                            page = zahl;
                        }
                        apiUrl = `https://api.disneyapi.dev/character?page=${page}`;
                        await fetch(apiUrl)
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const randomIndex = getRandom(0, data.data.length - 1);
                        const character = data.data[randomIndex];
                        const characterEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(character.name)
                            .setThumbnail(character.imageUrl)
                            .setFooter({ text: 'Daten von DisneyAPI' });
                        if (character.films.length > 0) {
                            characterEmbed.addFields(
                                { name: 'Filme', value: character.films.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.shortFilms.length > 0) {
                            characterEmbed.addFields(
                                { name: 'Kurzfilme', value: character.shortFilms.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.tvShows.length > 0) {
                            characterEmbed.addFields(
                                { name: 'TV-Shows', value: character.tvShows.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.videoGames.length > 0) {
                            characterEmbed.addFields(
                                { name: 'Videospiele', value: character.videoGames.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.parkAttractions.length > 0) {
                            characterEmbed.addFields(
                                { name: 'Parkattraktionen', value: character.parkAttractions.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.allies.length > 0) {
                            characterEmbed.addFields(
                                { name: 'Freunde', value: character.allies.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.enemies.length > 0) {
                            characterEmbed.addFields(
                                { name: 'Feinde', value: character.enemies.join(', ') || '-', inline: true },
                            );
                        }
                        if (character.sourceUrl) {
                            characterEmbed.setURL(character.sourceUrl);
                        }
                        await interaction.editReply({ embeds: [characterEmbed] });
                        break;
                    }
                    case 30: {
                        await fetch('https://riddles-api.vercel.app/random')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        const message = await interaction.editReply(data.riddle);
                        await sleep((delay + delay));
                        await message.reply(data.answer);
                        break;
                    }
                    case 31: {
                        await fetch('https://meme-api.com/gimme')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.url);
                        break;
                    }
                    case 32: {
                        await fetch('https://shrekofficial.com/quotes/random')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data);
                        break;
                    }
                    case 33: {
                        await fetch('https://randomfox.ca/floof/')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.image);
                        break;
                    }
                    case 34: {
                        await fetch('https://www.affirmations.dev/')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        await interaction.editReply(data.affirmation);
                        break;
                    }
                    case 35: {
                        await fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
                            .then((response) => response.json())
                            .then((mydata) => {
                                data = mydata;
                            });
                        let randomIndex = getRandom(0, data.length - 1);
                        if (zahl > 0 && zahl < data.length) {
                            randomIndex = zahl;
                        }
                        const product = data[randomIndex];
                        const productEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(product.name)
                            .setDescription(product.description ? product.description.trim().substring(0, 800) + (product.description.length > 800 ? '...' : '') : '-')
                            .setURL(product.product_link)
                            .setThumbnail(product.image_link)
                            .addFields(
                                { name: 'Marke', value: product.brand || '-', inline: true },
                                { name: 'Preis', value: product.price ? `$${product.price}` : '-', inline: true },
                                { name: 'Typ', value: product.product_type || '-', inline: true },
                            )
                            .setFooter({ text: 'Daten von MakeupAPI' });
                        await interaction.editReply({ embeds: [productEmbed] });
                        break;
                    }
                    default: {
                        await interaction.editReply('Zufällige API-Antwort: Default');
                    }
                }
                console.log(randomNumber);
            } else {
                console.log('ERROR: Unknown subcommand');
                await interaction.editReply('Irgendwas hat hier nicht gepasst, sorry!');
            }
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: false,
        deleted: false
    },
};