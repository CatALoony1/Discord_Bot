const { Message } = require('discord.js');
const giveXP = require('../../utils/giveXP');
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id) || message.webhookId) return;
  var xpToGive = (getRandomXp(5, 15));
  await giveXP(message.member, xpToGive, message.channel, true);
  cooldowns.add(message.author.id);
  setTimeout(() => {
    cooldowns.delete(message.author.id);
  }, 15000); // Cooldown 15000 = 15sec
};