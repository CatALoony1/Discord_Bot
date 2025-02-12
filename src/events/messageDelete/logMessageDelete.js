require('dotenv').config();
const { EmbedBuilder, Message, AuditLogEvent } = require('discord.js');
/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message, client) => {
  console.log(`message deleted in ${message.channel}`);
  if (message.author != null && message.author.bot) return;
  try {
    const targetChannel = message.guild.channels.cache.get(process.env.LOG_ID) || (await message.guild.channels.fetch(process.env.LOG_ID));
    if (!targetChannel) {
      console.log('Fehler, Logchannel gibts nicht');
      return;
    }
    const logs = await message.guild.fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
      limit: 1,
    });
    const firstEntry = logs.entries.first();
    const { executorId, target, targetId } = firstEntry;
    const user = await client.users.fetch(executorId);
    if (user.bot) return;
    let description = 'Nachricht war vor restart, leer oder ein Embed';
    if(message.content != null && message.content.length >= 1){
      description = `${message.content}`;
    }
    const messageDeleted = new EmbedBuilder();
    messageDeleted.setColor(0xff0000);
    messageDeleted.setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 256 }) });
    messageDeleted.setTimestamp(Date.now());
    messageDeleted.setTitle(`Nachricht gelöscht in ${message.channel}`);
    messageDeleted.setDescription(description);
    targetChannel.send({ embeds: [messageDeleted] });
  } catch (error) {
    console.log(error);
  }
};