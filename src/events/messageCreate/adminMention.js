const { Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const Config = require('../../models/Config');
const Begruessung = require('../../models/Begruessung');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
        console.log('contacting admin AI');
        const prompt = message.content.replace(`<@${process.env.ADMIN_ID}>`, 'Jonas');
        const genAI = new GoogleGenerativeAI(process.env.AI_API);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: "Dein Name ist Jonas, du befindest dich auf einem Discord Server. Deine Antworten sind kurz und knapp.",
        });
        //model.systemInstruction: 'Dein Name ist Jonas, du befindest dich auf einem Discord Server. Deine Antworten sind kurz und knapp.';
        console.log(`AI-Input:${String(prompt)}`);
        const result = await model.generateContent(String(prompt));
        console.log(`AI-Result:${result.response.text()}`);
        await webhookClient.send(`Da Jonas aktuell keine Lust hat, werde ich antworten:\n\n${result.response.text()}\n\n\n||Diese Antwort entspricht zu 100% der Meinung und ist definitiv nicht KI-generiert. Vielleicht lüge ich aber auch.||`);
    } catch (error) {
        console.log(error);
    }
};