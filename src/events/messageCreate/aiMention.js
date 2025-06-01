const { Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const Begruessung = require('../../models/Begruessung');
const getAIResult = require('../../utils/getAIResult');
const Config = require('../../models/Config');

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
    if (!message.inGuild() || message.author.bot || (!message.content.includes(process.env.KI_JONAS) && !message.content.includes(process.env.KI_BAERCHEN) && !message.content.includes(process.env.KI_SILVERLIVER)) || message.webhookId) return;
    console.log(`KI Mentioned`);
    try {
        const prompt = message.content.replaceAll(`<@&${process.env.KI_JONAS}>`, 'Jonas').replaceAll(`<@&${process.env.KI_BAERCHEN}>`, 'Bärchen').replaceAll(`<@&${process.env.KI_SILVERLIVER}>`, 'Silverliver');
        if (message.content.includes(process.env.KI_JONAS)) {
            await callAI(message, process.env.ADMIN_ID, 'Jonas', prompt);
        }
        if (message.content.includes(process.env.KI_BAERCHEN)) {
            await callAI(message, '345554876153200642', 'Bärchen', prompt);
        }
        if (message.content.includes(process.env.KI_SILVERLIVER)) {
            await callAI(message, '470661320434515989', 'Silverliver', prompt);
        }
    } catch (error) {
        console.log(error);
    }
};

async function callAI(message, id, person, prompt) {
    let begruessung = await Begruessung.findOne({
        guildId: process.env.GUILD_ID,
        authorId: `${message.channel.id};${id}`,
    });
    if (!begruessung) {
        begruessung = await Begruessung.findOne({
            guildId: process.env.GUILD_ID,
            authorId: id,
        });
    }
    if (!begruessung) return;
    let webhookClient = new WebhookClient({ id: begruessung.webhookId, token: begruessung.webhookToken });

    let sysInstruction = `Dein Name ist ${person} und du befindest dich auf einem Discord Server namens 'Versager Verein'.`;
    if (person == 'Jonas') {
        const config = await Config.findOne({
            key: 'KI_SysInstruct',
            guildId: process.env.GUILD_ID,
        });
        if (config) {
            sysInstruction = `${sysInstruction} ${config.value}`;
        } else {
            sysInstruction = `${sysInstruction} du hast aktuell keine Lust auf die anderen und bist sehr negativ.`;
        }
    } else if (person == 'Bärchen') {
        sysInstruction = `${sysInstruction} Du kommst aus Österreich und hast den Kärntner Dialekt. Du bist immer lieb, nett und positiv zu allen, außer zu jonas und Metti.`;
    } else if (person == 'Silverliver') {
        sysInstruction = `${sysInstruction} Du bist eine 1995 geborene Frau und sehr lieb zu allen. Du bist ein fröhlicher Mensch der schnulzige Sachen wie Lebensweisheiten mag. Du magst Pokemon, dein Lieblingspokemon ist Arkani. Du bist von Beruf Detailhandelsfachfrau Nahrungs und Genussmittel und spielst in deiner Freizeit gerne Survival und Horror Spiele.`;
    }
    let response = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction);
    await webhookClient.send(`${response.text}\n||KI-Generierter Text!||`);
}