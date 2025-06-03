const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

const nsfw = [
    'waifu',
    'neko',
    'trap',
    'blowjob',
];

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Rufe eine zufällige API auf.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Was für ne Waifu möchtest du?')
                .setRequired(false)
                .addChoices(
                    { name: 'alex-nsfw', value: 'alex-nsfw' },
                    { name: 'waifu', value: 'waifu' },
                    { name: 'neko', value: 'neko' },
                    { name: 'shinobu', value: 'shinobu' },
                    { name: 'megumin', value: 'megumin' },
                    { name: 'bully', value: 'bully' },
                    { name: 'cuddle', value: 'cuddle' },
                    { name: 'cry', value: 'cry' },
                    { name: 'hug', value: 'hug' },
                    { name: 'awoo', value: 'awoo' },
                    { name: 'kiss', value: 'kiss' },
                    { name: 'lick', value: 'lick' },
                    { name: 'pat', value: 'pat' },
                    { name: 'smug', value: 'smug' },
                    { name: 'bonk', value: 'bonk' },
                    { name: 'yeet', value: 'yeet' },
                )
        )
        .addStringOption(option =>
            option.setName('type2')
                .setDescription('Was für ne Waifu möchtest du?')
                .setRequired(false)
                .addChoices(
                    { name: 'blush', value: 'blush' },
                    { name: 'smile', value: 'smile' },
                    { name: 'wave', value: 'wave' },
                    { name: 'highfive', value: 'highfive' },
                    { name: 'handhold', value: 'handhold' },
                    { name: 'nom', value: 'nom' },
                    { name: 'bite', value: 'bite' },
                    { name: 'glomp', value: 'glomp' },
                    { name: 'slap', value: 'slap' },
                    { name: 'kill', value: 'kill' },
                    { name: 'kick', value: 'kick' },
                    { name: 'happy', value: 'happy' },
                    { name: 'wink', value: 'wink' },
                    { name: 'poke', value: 'poke' },
                    { name: 'dance', value: 'dance' },
                    { name: 'cringe', value: 'cringe' }
                )
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const type = interaction.options.getString('type');
            const type2 = interaction.options.getString('type2');
            if (type === null && type2 === null) {
                await interaction.reply('Bitte gib einen Typ an!');
                return;
            }
            const selectedType = type || type2;
            const fetch = await import('node-fetch').then(module => module.default);
            await interaction.deferReply();
            let data = null;
            let apiUrl = null;
            if (selectedType === 'alex-nsfw') {
                if (interaction.user.id == '1182304009877459005') {
                    apiUrl = `https://api.waifu.pics/nsfw/${nsfw[getRandom(0, nsfw.length - 1)]}`;
                    await fetch(apiUrl)
                        .then((response) => response.json())
                        .then((mydata) => {
                            data = mydata;
                        });
                    await interaction.editReply(data.url);
                } else {
                    await interaction.editReply('Du bist nicht Alex!');
                    return;
                }
            } else {
                apiUrl = `https://api.waifu.pics/sfw/${selectedType}`;
                await fetch(apiUrl)
                    .then((response) => response.json())
                    .then((mydata) => {
                        data = mydata;
                    });
                await interaction.editReply(data.url);
            }
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: false,
        deleted: true
    },
};