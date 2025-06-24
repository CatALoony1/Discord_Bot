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
    if (!message.inGuild() || message.author.bot || !message.content.includes(process.env.KI_JONAS) || message.webhookId) return;
    console.log(`KI Mentioned`);
    try {
        const prompt = message.content.replaceAll(`<@&${process.env.KI_JONAS}>`, 'Jonas');
        if (message.content.includes(process.env.KI_JONAS)) {
            await callAI(message, process.env.ADMIN_ID, 'Jonas', prompt);
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

    let sysInstruction = `Dein Name ist ${person} und du befindest dich auf einem Discord Server namens 'Versager Verein'. Du beachtest die Nachrichtengrenze von Discord von 2000 Zeichen und antwortest deshalb nicht mit mehr als 1500 Zeichen.`;
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
    }
    let response = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction);
    await webhookClient.send(`${response.text}\n||KI-Generierter Text!||`);
}