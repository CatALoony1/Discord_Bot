const Hangman = require("../../models/Hangman");
require('dotenv').config();
const { Message, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('node:path');
const giveXP = require("../../utils/giveXP");
/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
    if (!message.inGuild() || message.author.bot || message.channel.id !== process.env.SPIELE_ID || message.webhookId || !message.reference) return;
    try {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        const hangman = await Hangman.findOne({ messageId: referencedMessage.id });
        if (!hangman) return;
        if (hangman.status === 'beendet') {
            await message.reply('Das Spiel ist bereits beendet!');
            return;
        }
        if (message.author.id === hangman.authorId) {
            await message.reply('Deiner eigener Buchstabe zählt nicht!');
            return;
        }
        const guessedLetter = message.content.toUpperCase().trim();
        if ((guessedLetter.length !== 1 && guessedLetter != hangman.word) || !/^[a-zA-Z]$/.test(guessedLetter)) {
            await message.reply('Bitte gib nur einen Buchstaben ein!');
            return;
        }
        if (hangman.buchstaben.includes(guessedLetter)) {
            await message.reply('Du hast diesen Buchstaben bereits geraten!');
            return;
        }
        hangman.buchstaben.push(guessedLetter);
        if (!hangman.word.includes(guessedLetter)) {
            hangman.fehler++;
            if (hangman.fehler >= 8) {
                hangman.status = 'beendet';
                const file = new AttachmentBuilder(path.join(__dirname, '../../../img/hangman8.png'));
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Galgenmännchen - Spiel beendet')
                    .setDescription(`Verloren! Das Wort war: **${hangman.word}**`)
                    .setImage('attachment://hangman8.png');
                await referencedMessage.edit({ embeds: [embed], files: [file] });
                await message.reply('Du hast verloren!');
                await hangman.save();
                await message.react('💀');
            } else {
                const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
                const leerzeichen = hangman.word.split('').map(letter => (hangman.buchstaben.includes(letter) ? letter : '\\_')).join(' ');
                const embed = new EmbedBuilder()
                    .setColor(0x0033cc)
                    .setTitle('Galgenmännchen')
                    .setDescription(`${leerzeichen}\n\n${hangman.word.length} Buchstaben\nBuchstaben: ${hangman.buchstaben.join(', ')}\nFehler: ${hangman.fehler}/8`)
                    .setImage(`attachment://hangman${hangman.fehler}.png`);
                await referencedMessage.edit({ embeds: [embed], files: [file] });
                await hangman.save();
                await message.react('❌');
            }
        } else if (hangman.word === guessedLetter) {
            hangman.status = 'beendet';
            const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Galgenmännchen - Spiel beendet')
                .setDescription(`Gewonnen! Das Wort war: **${hangman.word}**`)
                .setImage(`attachment://hangman${hangman.fehler}.png`);
            await referencedMessage.edit({ embeds: [embed], files: [file] });
            giveXP(message.member, 100, 100, message.channel, false, false, false);
            await hangman.save();
            await message.react('🏆');
        } else {
            //check if all letters are found
            const allLettersFound = hangman.word.split('').every(letter => hangman.buchstaben.includes(letter));
            if (allLettersFound) {
                hangman.status = 'beendet';
                const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Galgenmännchen - Spiel beendet')
                    .setDescription(`Gewonnen! Das Wort war: **${hangman.word}**`)
                    .setImage(`attachment://hangman${hangman.fehler}.png`);
                await referencedMessage.edit({ embeds: [embed], files: [file] });
                giveXP(message.member, 100, 100, message.channel, false, false, false);
                await hangman.save();
                await message.react('🏆');
                return;
            }
            const leerzeichen = hangman.word.split('').map(letter => (hangman.buchstaben.includes(letter) ? letter : '\\_')).join(' ');
            const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
            const embed = new EmbedBuilder()
                .setColor(0x0033cc)
                .setTitle('Galgenmännchen')
                .setDescription(`${leerzeichen}\n\n${hangman.word.length} Buchstaben\nBuchstaben: ${hangman.buchstaben.join(', ')}\nFehler: ${hangman.fehler}/8`)
                .setImage(`attachment://hangman${hangman.fehler}.png`);
            await referencedMessage.edit({ embeds: [embed], files: [file] });
            await hangman.save();
            await message.react('✅');
        }
    } catch (error) {
        console.log(error);
    }
};