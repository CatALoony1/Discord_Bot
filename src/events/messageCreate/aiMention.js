const { Message, WebhookClient, AttachmentBuilder } = require('discord.js');
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
    if (!message.inGuild() || message.author.bot || (!message.content.includes(process.env.KI_JONAS) && !message.content.includes(process.env.KI_BAERCHEN) && !message.content.includes(process.env.KI_SILVERLIVER)) || message.webhookId) return;
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

    let sysInstruction = `Dein Name ist ${person} und du befindest dich auf einem Discord Server.`;
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
    let response = null;
    if ((prompt.toLowerCase().includes('erzeuge') || prompt.toLowerCase().includes('erstelle') || prompt.toLowerCase().includes('generiere')) && prompt.toLowerCase().includes('bild')) {
        response = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction, true);
    } else {
        response = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction, false);
    }
    if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        let textToSend = "";
        let imageBuffer = null;
        let imageName = null;

        for (const part of response.candidates[0].content.parts) {
            console.log(part);
            if (part.text) {
                textToSend += part.text + "\n";
                console.log(part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                imageBuffer = Buffer.from(imageData, "base64");
                imageName = "gemini-image." + part.inlineData.mimeType.split('/')[1];
                console.log(`Image data found (${part.inlineData.mimeType}). Preparing for Discord.`);
            }
        }
        if (textToSend && imageBuffer && imageName) {
            const attachment = new AttachmentBuilder(imageBuffer, { name: imageName });
            await webhookClient.send({ content: `${textToSend}\n||KI-Generierter Text!||`, files: [attachment] });
            console.log("Text and image sent to Discord.");
        } else if (textToSend) {
            await webhookClient.send(`${textToSend}\n||KI-Generierter Text!||`);
            console.log("Text sent to Discord.");
        } else if (imageBuffer && imageName) {
            const attachment = new AttachmentBuilder(imageBuffer, { name: imageName });
            await webhookClient.send({ files: [attachment] });
            console.log("Image sent to Discord.");
        }
    }
}