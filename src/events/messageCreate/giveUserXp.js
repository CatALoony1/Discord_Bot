const { Message, EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');
const Config = require('../../models/Config');
const calculateLevelXp = require('../../utils/calculateLevelXp');
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
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

  let multiplier = 1;
let bonusWordList = [];
for await (const doc of Config.find()){
 if(doc.key == "xpMultiplier"){
 multiplier = Number(doc.value);
}else if(doc.key == "bonusWords"){
bonusWordList = doc.value.split(',');
}
}

  //BonusXP
  var bonusXP = 0;
  const messageLength = message.content.length;
  if (messageLength == 69) {
    bonusXP += 69;
  } else if (messageLength == 666) {
    bonusXP += 66;
  } else if (messageLength >= 1500) {
    bonusXP += 100;
    if (messageLength >= 3000) {
      bonusXP += 150;
    }
  }
  bonusWordList.forEach(word => {
    if (message.content.toLowerCase().includes(word)) {
      bonusXP += getRandomXp(10, 20);
    }
  });
  if(bonusXP > 0){
    await message.react("⭐");
    console.log(`user ${message.author.tag} received ${bonusXP} Bonus XP`);
  }
  
  const xpToGive = (getRandomXp(5, 15) * multiplier) + bonusXP;
  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };
  try {
    const level = await Level.findOne(query);
    console.log(`user ${message.author.tag} received ${xpToGive} XP`);
    if (level) {
      level.xp += xpToGive;
      level.allxp += xpToGive;
      level.messagexp += xpToGive;
      level.thismonth += xpToGive;
      level.bonusclaimed += bonusXP;
      level.messages += 1;
      level.lastMessage = Date.now();
      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = level.xp - calculateLevelXp(level.level);
        level.level += 1;
        console.log(`user ${message.author.tag} reached level ${level.level}`);
        let description = `🎉 Glückwunsch ${message.member}! Du hast **Level ${level.level}** erreicht!⚓`;

        if (roles.has(level.level)) {
          let newRole = roles.get(level.level);
          description = `🎉 Glückwunsch ${message.member}! Du hast **Level ${level.level}** erreicht und bist somit zum ${newRole} aufgestiegen!⚓`;

          for (const value of roles.values()) {
            if (message.member.roles.cache.some(role => role.name === value)) {
              let tempRole = message.guild.roles.cache.find(role => role.name === value);
              await message.guild.members.cache.get(message.member.id).roles.remove(tempRole);
              console.log(`Role ${value} was removed from user ${message.member.user.tag}`);
            }
          }
          let role = message.guild.roles.cache.find(role => role.name === newRole);
          await message.guild.members.cache.get(message.member.id).roles.add(role);
          console.log(`Role ${newRole} was given to user ${message.member.user.tag}`);
          if (level.level === 1) {
            let memberRole = message.guild.roles.cache.find(role => role.name === 'Mitglied');
            await message.guild.members.cache.get(message.member.id).roles.add(memberRole);
            console.log(`Role Mitglied was given to user ${message.member.user.tag}`);
          }
        }

        const embed = new EmbedBuilder()
          .setTitle('Glückwunsch!')
          .setDescription(description)
          .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
          .setColor(0x0033cc);
        message.channel.send({ embeds: [embed] });
      }
      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 15000); // Cooldown 15000 = 15sec
    } else {
      console.log(`new user ${message.author.tag} added to database`);
      const newLevel = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
        allxp: xpToGive,
        messages: 1,
        lastMessage: Date.now(),
        userName: message.author.tag,
        messagexp: xpToGive,
        voicexp: 0,
        voicetime: 0,
        thismonth: xpToGive,
        bonusclaimed: bonusXP,
      });
      await newLevel.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 15000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};