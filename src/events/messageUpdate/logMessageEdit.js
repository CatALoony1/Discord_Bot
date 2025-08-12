require('dotenv').config();
const { EmbedBuilder, Message } = require('discord.js');
/**
 * 
 * @param {Message} oldMessage 
 * @param {Message} newMessage 
 * @returns 
 */
module.exports = async (oldMessage, newMessage) => {
    if (newMessage.author.bot || newMessage.webhookId) return;
    if (oldMessage.content === newMessage.content) return;
    console.log(`message edited in ${newMessage.channel}`);
    try {
        const targetChannel = newMessage.guild.channels.cache.get(process.env.LOG_ID) || (await newMessage.guild.channels.fetch(process.env.LOG_ID));
        if (!targetChannel) {
            console.log('Fehler, Logchannel gibts nicht');
            return;
        }
        let oldMessageContent = oldMessage.content;
        let newMessageContent = newMessage.content;
        if (oldMessageContent && oldMessageContent.length > 1024) {
            oldMessageContent = oldMessageContent.substring(0, 1021) + '...';
        }
        if (newMessageContent && newMessageContent.length > 1024) {
            newMessageContent = newMessageContent.substring(0, 1021) + '...';
        }
        const messageEdited = new EmbedBuilder();
        messageEdited.setColor(0x0033cc);
        messageEdited.setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL({ size: 256 }) });
        messageEdited.setTimestamp(new Date());
        messageEdited.setTitle(`Nachricht bearbeitet in ${newMessage.channel}`);
        messageEdited.setURL(newMessage.url);
        messageEdited.addFields({ name: 'vorher', value: `${oldMessageContent}` });
        messageEdited.addFields({ name: 'nachher:', value: `${newMessageContent}` });

        targetChannel.send({ embeds: [messageEdited] });
    } catch (error) {
        console.log(error);
    }
};