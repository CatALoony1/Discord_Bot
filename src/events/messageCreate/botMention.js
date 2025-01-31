const { Message } = require('discord.js');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const answers = new Map([[1, 'Ja!'],
[2, 'Nein!'],
[3, 'Vielleicht!'],
[4, 'Frag erneut!'],
[5, 'Niemals!'],
[6, 'Darauf habe ich keine Antwort!'],
[7, 'Ist das nicht eindeutig?'],
[8, 'Formuliere die Frage bitte klarer.'],
[9, 'Ja, Ja und nochmal Ja!'],
[10, 'Darüber sollte demokratisch abgestimmt werden.']
]);

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
    if (!message.inGuild() || message.author.bot || !message.isMemberMentioned(client.user) || !message.content.includes("?")) return;
    message.reply(answers.get(getRandom(1, 10)));
};