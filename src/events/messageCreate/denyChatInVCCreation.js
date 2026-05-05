const { Message } = require('discord.js');
/**
 *
 * @param {Message} message
 * @returns
 */
module.exports = {
  run: async (message) => {
    if (!message.inGuild() || message.author.bot || message.webhookId) {
      return;
    }
    if (message.channel.id === process.env.VCCREATION_ID) {
      await message.delete();
    }
  },
};
