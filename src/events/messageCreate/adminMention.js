const { Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const Begruessung = require('../../models/Begruessung');
const getAIResult = require('../../utils/getAIResult');
const BotState = require('../../models/BotState');

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
    if (!message.inGuild() || message.author.bot || !message.content.includes(process.env.KI_JONAS) || message.webhookId || message.channel.id != process.env.WELCOME_ID) return;
    console.log(`Admin Mentioned`);
    try {
        const state = await BotState.findOne({
            guildId: process.env.GUILD_ID,
        });
        if (state) {
            if (state.state != 'neutral' && state.state != 'fischstäbchen') {
                return;
            }
        }
        const begruessung = await Begruessung.findOne({
            guildId: process.env.GUILD_ID,
            authorId: process.env.ADMIN_ID,
        });
        if (!begruessung) return;
        let webhookClient = new WebhookClient({ id: begruessung.webhookId, token: begruessung.webhookToken });
        const prompt = message.content.replace(`<@&${process.env.KI_JONAS}>`, 'Jonas');
        //const sysInstruction = "Dein Name ist Jonas, du befindest dich auf einem Discord Server und hast aktuell keine Lust auf die anderen. Deine Antworten sind kurz und knapp.";
        //const sysInstruction = "Dein Name ist Jonas, du befindest dich auf einem Discord Server und bist sehr kokett. Du Antwortest mit maximal einem Satz.";
        const sysInstruction = "Dein Name ist Jonas und du befindest dich auf einem Discord Server. Du antwortest mit maximal zwei Sätzen. Du schreibst wie ein möchtegern Gangster und benutzt sehr viel Slang.";
        const result = await getAIResult(prompt, sysInstruction);
        await webhookClient.send(`${result.response.text()}\n||Diese Antwort entspricht zu 100% meiner Meinung und ist definitiv nicht KI-generiert. Vielleicht lüge ich aber auch.||`);
    } catch (error) {
        console.log(error);
    }
};