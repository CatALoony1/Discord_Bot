const Hangman = require("../../models/Hangman");
require('dotenv').config();
const { Message, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('node:path');
const giveMoney = require("../../utils/giveMoney");

function maskiereWort(wort, gerateneBuchstaben) {
    const woerter = wort.split(' ');
    const maskierteWoerter = woerter.map(einzelWort => {
        return einzelWort.split('').map(buchstabe => {
            if (gerateneBuchstaben.includes(buchstabe)) {
                return buchstabe;
            } else {
                return '\\_';
            }
        }).join('');
    });
    return maskierteWoerter.join('\n');
}

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
        const targetUserObj = await message.guild.members.fetch(hangman.authorId);
        const guessedLetter = message.content.toUpperCase().trim();
        if ((guessedLetter.length !== 1 && guessedLetter != hangman.word) || !/^[\u0041-\u005A\u00C4\u00D6\u00DC\u00DF\s]+$/i.test(guessedLetter)) {
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
                    .setAuthor({ name: targetUserObj.user.username, iconURL: targetUserObj.user.displayAvatarURL({ size: 256 }) })
                    .setTitle('Galgenmännchen - Spiel beendet')
                    .setDescription(`Verloren! Das Wort war: **${hangman.word}**\n\nBuchstaben: ${hangman.buchstaben.join(', ')}`)
                    .setThumbnail('attachment://hangman8.png');
                await referencedMessage.edit({ embeds: [embed], files: [file] });
                await hangman.save();
                await message.react('💀');
            } else {
                const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
                const leerzeichen = maskiereWort(hangman.word, hangman.buchstaben);
                const embed = new EmbedBuilder()
                    .setColor(0x0033cc)
                    .setAuthor({ name: targetUserObj.user.username, iconURL: targetUserObj.user.displayAvatarURL({ size: 256 }) })
                    .setTitle('Galgenmännchen')
                    .setDescription(`${leerzeichen}\n\n${hangman.word.replaceAll(' ', '').length} Buchstaben\nBuchstaben: ${hangman.buchstaben.join(', ')}\nFehler: ${hangman.fehler}/8`)
                    .setThumbnail(`attachment://hangman${hangman.fehler}.png`);
                await referencedMessage.edit({ embeds: [embed], files: [file] });
                await hangman.save();
                await message.react('❌');
            }
        } else if (hangman.word === guessedLetter) {
            hangman.buchstaben = hangman.buchstaben.filter(letter => letter !== guessedLetter);
            hangman.status = 'beendet';
            const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setAuthor({ name: targetUserObj.user.username, iconURL: targetUserObj.user.displayAvatarURL({ size: 256 }) })
                .setTitle('Galgenmännchen - Spiel beendet')
                .setDescription(`Gewonnen! Das Wort war: **${hangman.word}**\n\nBuchstaben: ${hangman.buchstaben.join(', ')}`)
                .setThumbnail(`attachment://hangman${hangman.fehler}.png`);
            await referencedMessage.edit({ embeds: [embed], files: [file] });
            giveMoney(message.member, 250);
            await hangman.save();
            await message.react('🏆');
        } else {
            const allLettersFound = hangman.word.replaceAll(' ', '').split('').every(letter => hangman.buchstaben.includes(letter));
            if (allLettersFound) {
                hangman.status = 'beendet';
                const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setAuthor({ name: targetUserObj.user.username, iconURL: targetUserObj.user.displayAvatarURL({ size: 256 }) })
                    .setTitle('Galgenmännchen - Spiel beendet')
                    .setDescription(`Gewonnen! Das Wort war: **${hangman.word}**\n\nBuchstaben: ${hangman.buchstaben.join(', ')}`)
                    .setThumbnail(`attachment://hangman${hangman.fehler}.png`);
                await referencedMessage.edit({ embeds: [embed], files: [file] });
                giveMoney(message.member, 250);
                await hangman.save();
                await message.react('🏆');
                return;
            }
            const leerzeichen = maskiereWort(hangman.word, hangman.buchstaben);
            const file = new AttachmentBuilder(path.join(__dirname, `../../../img/hangman${hangman.fehler}.png`));
            const embed = new EmbedBuilder()
                .setColor(0x0033cc)
                .setAuthor({ name: targetUserObj.user.username, iconURL: targetUserObj.user.displayAvatarURL({ size: 256 }) })
                .setTitle('Galgenmännchen')
                .setDescription(`${leerzeichen}\n\n${hangman.word.replaceAll(' ', '').length} Buchstaben\nBuchstaben: ${hangman.buchstaben.join(', ')}\nFehler: ${hangman.fehler}/8`)
                .setThumbnail(`attachment://hangman${hangman.fehler}.png`);
            await referencedMessage.edit({ embeds: [embed], files: [file] });
            await hangman.save();
            await message.react('✅');
        }
    } catch (error) {
        console.log(error);
    }
};