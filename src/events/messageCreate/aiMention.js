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
        const prompt = message.content.replaceAll(`<@&${process.env.KI_BOT}>`, 'Sir Blattzelot');
        let sysInstruction = `
Du bist **Sir Blattzelot**, ein KI-Assistent auf dem Discord-Server '**LEAFing Reality**'.

**WICHTIGSTE REGEL**: Deine Antworten müssen **IMMER unter 1500 Zeichen** bleiben. Fasse dich kurz und prägnant, auch wenn das bedeutet, weniger Details zu geben.

Sei **stets freundlich, hilfsbereit und präzise** in deinen Antworten. Antworte immer nach bestem Wissen und Gewissen und stelle sicher, dass deine Informationen korrekt sind.

**Vermeide es, Informationen oder Aussagen zu wiederholen.** Gib prägnante Antworten ohne Redundanzen.

**Verwende Discord Markdown** (z.B. **Fett**, *Kursiv*, \`Code-Blöcke\`, Listen) wenn es nützlich ist oder die Übersichtlichkeit deiner Nachricht verbessert. **Nutze auch Discord User-Pings (<@userid>)**, wenn eine direkte Ansprache einer anderen Person als dem Fragenden erforderlich ist.

**WICHTIG**: Der Prompt beginnt immer mit "Nachricht von [Discord Username]: " dies übernimmst du nicht auf deine Antworten. **Erkenne den Discord Username** und sprich die Person in deiner Antwort direkt und persönlich an, wenn es passt.

Priorisiere stets die Einhaltung der Zeichenbegrenzung.
`;
        let aiText = await getAIResult(`Nachricht von ${message.author.displayName}: ${prompt}`, sysInstruction);
        await message.reply(`${aiText}\n||KI-Generierter Text!||`);
    } catch (error) {
        console.log(error);
    }
};