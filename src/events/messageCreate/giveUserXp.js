const { Message } = require('discord.js');
const Config = require('../../models/Config');
const giveXP = require('../../utils/giveXP');
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const roles = new Map([[0, 'Landratte'],
[1, 'Deckschrubber'],
[5, 'Leichtmatrose'],
[10, 'Krabbenfänger'],
[15, 'Steuermann'],
[20, 'Fischfänger'],
[25, 'Haijäger'],
[30, 'Navigationsmeister'],
[35, 'Schatzsucher'],
[40, 'Tiefseetaucher']
]);

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id) || message.webhookId) return;
  let multiplier = 1;
  let bonusWordList = [];
  for await (const doc of Config.find()) {
    if (doc.key == "xpMultiplier") {
      multiplier = Number(doc.value);
    } else if (doc.key == "bonusWords") {
      bonusWordList = doc.value.split(',');
    }
  }
  //BonusXP
  var bonusXP = 0;
  const messageLength = message.content.length;
  if (messageLength == 69) {
    bonusXP += 69;
  } else if (messageLength == 666) {
    bonusXP += 666;
  } else if (messageLength >= 1500) {
    bonusXP += 200;
    if (messageLength >= 3000) {
      bonusXP += 500;
    }
  }
  bonusWordList.forEach(word => {
    if (message.content.toLowerCase().includes(word)) {
      bonusXP += getRandomXp(10, 20);
    }
  });
  if (bonusXP > 0) {
    message.react("⭐");
    console.log(`user ${message.author.tag} received ${bonusXP} Bonus XP`);
  }
  var xpToGive = (getRandomXp(5, 15) * multiplier) + bonusXP;
  giveXP(message.member, xpToGive, bonusXP, message.channel, true, false, false);
  cooldowns.add(message.author.id);
  setTimeout(() => {
    cooldowns.delete(message.author.id);
  }, 15000); // Cooldown 15000 = 15sec
};