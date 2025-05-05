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
        let oldMessageConent = oldMessage.content;
        let newMessageConent = newMessage.content;
        if (oldMessageConent.length > 1024) {
            oldMessageConent = oldMessageConent.substring(0, 1021) + '...';
        }
        if (newMessageConent.length > 1024) {
            newMessageConent = newMessageConent.substring(0, 1021) + '...';
        }
        const messageEdited = new EmbedBuilder();
        messageEdited.setColor(0x0033cc);
        messageEdited.setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL({ size: 256 }) });
        messageEdited.setTimestamp(Date.now());
        messageEdited.setTitle(`Nachricht bearbeitet in ${newMessage.channel}`);
        messageEdited.setURL(newMessage.url);
        messageEdited.addFields({ name: 'vorher', value: `${oldMessageConent}` });
        messageEdited.addFields({ name: 'nachher:', value: `${newMessageConent}` });

        targetChannel.send({ embeds: [messageEdited] });
    } catch (error) {
        console.log(error);
    }
};