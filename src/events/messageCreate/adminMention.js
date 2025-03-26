const { Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const Config = require('../../models/Config');
const Begruessung = require('../../models/Begruessung');
const getAIResult = require('../../utils/getAIResult');

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message, client) => {
    if (!message.inGuild() || message.author.bot || !message.content.includes(process.env.ADMIN_ID) || message.webhookId || message.channel.id != process.env.WELCOME_ID) return;
    console.log(`Admin Mentioned`);
    try {
        const config = await Config.findOne({
            key: 'adminAway',
        });
        if (!config || config.value != 'J') return;
        const begruessung = await Begruessung.findOne({
            guildId: process.env.GUILD_ID,
            authorId: process.env.ADMIN_ID,
        });
        if (!begruessung) return;
        let webhookClient = new WebhookClient({ id: begruessung.webhookId, token: begruessung.webhookToken });
        const prompt = message.content.replace(`<@${process.env.ADMIN_ID}>`, 'Jonas');
        const sysInstruction = "Dein Name ist Jonas, du befindest dich auf einem Discord Server und hast aktuell keine Lust auf die anderen. Deine Antworten sind kurz und knapp.";
        const result = await getAIResult(prompt, sysInstruction);
        await webhookClient.send(`Da Jonas aktuell keine Lust hat, werde ich antworten:\n${result.response.text()}\n||Diese Antwort entspricht zu 100% meiner Meinung und ist definitiv nicht KI-generiert. Vielleicht lüge ich aber auch.||`);
    } catch (error) {
        console.log(error);
    }
};