const { Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const Begruessung = require('../../models/Begruessung');
const getAIResult = require('../../utils/getAIResult');
const BotState = require('../../models/BotState');
const Config = require('../../models/Config');

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
    if (!message.inGuild() || message.author.bot || (!message.content.includes(process.env.KI_JONAS) && !message.content.includes(process.env.KI_BAERCHEN)) || message.webhookId || message.channel.id != process.env.WELCOME_ID) return;
    console.log(`KI Mentioned`);
    try {
        const state = await BotState.findOne({
            guildId: process.env.GUILD_ID,
        });
        if (state) {
            if (state.state != 'neutral' && state.state != 'fischstäbchen') {
                return;
            }
        }
        const prompt = message.content.replaceAll(`<@&${process.env.KI_JONAS}>`, 'Jonas').replaceAll(`<@&${process.env.KI_BAERCHEN}>`, 'Bärchen');
        if (message.content.includes(process.env.KI_JONAS)) {
            await callAI(message, process.env.ADMIN_ID, 'Jonas', prompt);
        }
        if (message.content.includes(process.env.KI_BAERCHEN)) {
            await callAI(message, '345554876153200642', 'Bärchen', prompt);
        }
    } catch (error) {
        console.log(error);
    }
};

async function callAI(message, id, person, prompt) {
    const begruessung = await Begruessung.findOne({
        guildId: process.env.GUILD_ID,
        authorId: id,
    });
    if (!begruessung) return;
    let webhookClient = new WebhookClient({ id: begruessung.webhookId, token: begruessung.webhookToken });
    
    let sysInstruction = `Dein Name ist ${person} und du befindest dich auf einem Discord Server. Du antwortest mit maximal zwei Sätzen.`;
    if (person == 'Jonas') {
        const config = await Config.findOne({
            key: 'KI_SysInstruct',
        });
        if (config) {
            sysInstruction = `${sysInstruction} ${config.value}`;
        } else {
            sysInstruction = `${sysInstruction} du hast aktuell keine Lust auf die anderen und bist sehr negativ.`;
        }
    } else if (person == 'Bärchen') {
        sysInstruction = `${sysInstruction} Du kommst aus Österreich und hast einen starken Dialekt. Du bist immer lieb, nett und positiv zu allen, außer zu jonas und Metti.`;
    }
    //const sysInstruction = "Dein Name ist Jonas, du befindest dich auf einem Discord Server und hast aktuell keine Lust auf die anderen. Deine Antworten sind kurz und knapp.";
    //const sysInstruction = "Dein Name ist Jonas, du befindest dich auf einem Discord Server und bist sehr kokett. Du Antwortest mit maximal einem Satz.";
    //const sysInstruction = "Dein Name ist Jonas und du befindest dich auf einem Discord Server. Du antwortest mit maximal zwei Sätzen. Du schreibst wie ein möchtegern Gangster und benutzt sehr viel Slang.";
    const result = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction);
    await webhookClient.send(`${result.response.text()}\n||KI-Generierter Text!||`);
}