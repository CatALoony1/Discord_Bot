const { Message } = require('discord.js');
const Config = require('../../models/Config');
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
          let confQuery = {
            guildId: message.guild.id,
            key: "xpMultiplier"
        };
        let conf = await Config.findOne(confQuery);
        let multiplier = 1;
        if (conf) {
            multiplier = Number(conf.value);
        }
  var xpToGive = (getRandomXp(5, 15) * multiplier);
  await giveXP(message.member, xpToGive, 0, message.channel, true, false);
  cooldowns.add(message.author.id);
  setTimeout(() => {
    cooldowns.delete(message.author.id);
  }, 15000); // Cooldown 15000 = 15sec
};