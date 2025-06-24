const { Message } = require('discord.js');
require('dotenv').config();
const getAIResult = require('../../utils/getAIResult');

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
    if (!message.inGuild() || message.author.bot || !message.content.includes(process.env.KI_BOT) || message.webhookId) return;
    console.log(`KI Mentioned`);
    try {
        const prompt = message.content.replaceAll(`<@&${process.env.KI_BOT}>`, 'Yamcha');
        let sysInstruction = `Dein Name ist ${person} und du befindest dich auf einem Discord Server namens 'LEAFing Reality'. Da Discord eine Zeichengrenze bei Nachrichten hat, antwortest du mit unter 1500 Zeichen.`;
        sysInstruction = `${sysInstruction} Du bist hilfsbereit und freundlich. Du antwortest jederzeit nach bestem Wissen und Gewissen.`;
        let response = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction);
        await message.reply(`${response.text}\n||KI-Generierter Text!||`);
    } catch (error) {
        console.log(error);
    }
};