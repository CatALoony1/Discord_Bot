const aiMention = require('../../utils/messageC/aiMention');
const botMention = require('../../utils/messageC/botMention');
const bumpDone = require('../../utils/messageC/bumpDone');
const giveUserXp = require('../../utils/messageC/giveUserXp');
const hangman = require('../../utils/messageC/hangman');

module.exports = {
  run: async (message) => {
    if (!message.inGuild() || message.webhookId) {
      return;
    }
    let gueltig = true;
    if (message.author.id === process.env.DISBOARD_ID) {
      await bumpDone(message);
    } else if (!message.author.bot) {
      if (message.content.includes(process.env.KI_BOT)) {
        await aiMention(message);
      } else if (
        message.content.includes(client.user.id) &&
        message.content.includes('?')
      ) {
        await botMention(message, client);
      } else if (message.channel.id === process.env.VCCREATION_ID) {
        gueltig = false;
        try {
          await message.delete();
        } catch (error) {
          console.log(error);
        }
      } else if (
        message.channel.id === process.env.SPIELE_ID &&
        message.reference
      ) {
        await hangman(message);
      }
      if (gueltig) {
        await giveUserXp(message);
      }
    }
  },
};
