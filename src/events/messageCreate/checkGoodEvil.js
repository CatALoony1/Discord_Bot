const { Message } = require('discord.js');
const BotState = require('../../models/BotState');

const goodList = ['lieb',
    'love',
    'romantik',
    'beziehung',
    'verbundenheit',
    'heirat',
    'hochzeit',
    'ehemann',
    'ehefrau',
    'jahrestag',
    '♥️',
    '❤️'];

const badList = [
    "idiot",
    "dummkopf",
    "trottel",
    "schwachkopf",
    "versager",
    "spinner",
    "blödmann",
    "depp",
    "arschloch",
    "wichser",
    "hurensohn",
    "lappen",
    "witzfigur",
    "dussel",
    "fick dich",
    "hass",
    "bitch",
    "vollpfosten",
    "trottel",
    "vollidiot",
    "schlampe",
    "schnapsdrossel",
    "dreckskerl",
    "kackbratze",
    "krüppel",
    "penner",
    "loser",
    "opfer",
    "hure",
    "missgeburt",
    "schlappschwanz",
    "nazi",
    "afd",
    "tot",
    "tod",
    "dead",
    "death",
    "dumm",
    "behindert",
    "scheiß"
];

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message, client) => {
    if (!message.inGuild() || message.author.bot) return;
    var state = await BotState.findOne({
        guildId: message.guild.id,
    });
    if (!state) {
        console.log(`Botstate entry created`);
        const newBotstate = new BotState({
            guildId: message.guild.id,
            evilCount: 0,
            loveCount: 0,
            state: 'neutral'
        });
        await newBotstate.save();
        state = newBotstate;
    }
    var content = message.content.toLowerCase();
    var goodYN = goodList.some(good => content.includes(good));
    if (goodYN) {
        var loveCount = state.loveCount + 1;
        if (loveCount == 100) {
            loveCount = 0;
            state.state = 'good';
            state.startTime = Date.now();
        }
        state.loveCount = loveCount;
        state.save();
        if (loveCount == 0) {
            message.reply("Ihr versprüht so viel Liebe, das macht mich ganz glücklich!");
        }
    } else {
        var evilYN = badList.some(bad => content.includes(bad));
        if (evilYN) {
            var evilCount = state.evilCount + 1;
            if (evilCount == 100) {
                evilCount = 0;
                state.state = 'evil';
                state.startTime = Date.now();
            }
            state.evilCount = evilCount;
            state.save();
            if (evilCount == 0) {
                message.reply("Sag mal geht's noch? Der ganze Hass und die Beleidigungen müssen ein Ende haben. Jeder der Beleidigt zu Fischstäbchen verarbeitet!");
            }
        }
    }
};