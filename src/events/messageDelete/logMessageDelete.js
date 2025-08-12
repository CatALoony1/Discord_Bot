require('dotenv').config();
const { EmbedBuilder, Message, AuditLogEvent, Client } = require('discord.js');
/**
 * 
 * @param {Message} message 
 * @param {Client} client
 * @returns 
 */
module.exports = async (message, client) => {
  console.log(`message deleted in ${message.channel}`);
  if ((message.author != null && (message.author.bot || message.webhookId)) || (message.channel.id === process.env.SPIELE_ID && message.reference && message.content.length == 1)) return;
  try {
    const targetChannel = message.guild.channels.cache.get(process.env.LOG_ID) || (await message.guild.channels.fetch(process.env.LOG_ID));
    if (!targetChannel) {
      console.log('Fehler, Logchannel gibts nicht');
      return;
    }
    var user = client.user;
    if (message.author == null) {
      const logs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
      });
      const firstEntry = logs.entries.first();
      const { executorId } = firstEntry;
      user = await client.users.fetch(executorId);
      if (user.bot || message.webhookId) return;
    } else {
      if (message.guild.members.cache.find(m => m.id === message.author.id)?.id) {
        user = message.author;
      }
    }
    let description = 'Nachricht war vor restart, leer oder ein Embed';
    if (message.content != null && message.content.length >= 1) {
      description = `${message.content}`;
      if (description.length > 1024) {
        description = description.substring(0, 1021) + '...';
      }
    }
    const messageDeleted = new EmbedBuilder();
    messageDeleted.setColor(0xff0000);
    messageDeleted.setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 256 }) });
    messageDeleted.setTimestamp(new Date());
    messageDeleted.setTitle(`Nachricht gelöscht in ${message.channel}`);
    messageDeleted.setDescription(description);
    targetChannel.send({ embeds: [messageDeleted] });
  } catch (error) {
    console.log(error);
  }
};