
const { EmbedBuilder } = require('discord.js');
const Level = require('../models/Level');
async function createLeaderboardEmbeds(page, interaction, version) {
  const fetchedLevel = await Level.find({
    guildId: interaction.guild.id,
  });

  if (fetchedLevel.length === 0) {
    console.log('ERROR: Niemand auf dem Server hat Level');
    return;
  }
  var oldUsers = [];
  for (let j = 0; j < fetchedLevel.length; j++) {
    if (!(interaction.guild.members.cache.find(m => m.id === fetchedLevel[j].userId)?.id)) {
      oldUsers[oldUsers.length] = j;
    }
  }
  for (let j = 0; j < oldUsers.length; j++) {
    fetchedLevel.splice(oldUsers[j] - j, 1);
  }
  switch (version) {
    case 'XP':
      fetchedLevel.sort((a, b) => {
        if (a.level === b.level) {
          return b.allxp - a.allxp;
        } else {
          return b.level - a.level;
        }
      });
      break;
    case 'Voice':
      fetchedLevel.sort((a, b) => {
        return b.voicetime - a.voicetime;
      });
      break;
    case 'Messages':
      fetchedLevel.sort((a, b) => {
        return b.messages - a.messages;
      });
      break;
    default:
      console.log('ERROR: Invalid version provided for leaderboard');
      return;
  }

  var i = 0 + (page * 5);
  var max = 5 + (page * 5);
  const embed = new EmbedBuilder()
    .setTitle(`Rangliste - ${version}`)
    .setDescription(`${page + 1}/${Math.ceil(fetchedLevel.length / 5)}`)
    .setColor(0x0033cc);
  for (i; i < max; i++) {
    if (i === fetchedLevel.length) {
      break;
    }
    let userObj = await interaction.guild.members.fetch(fetchedLevel[i].userId);
    let value;
    var time;
    if (fetchedLevel[i].voicetime >= 60) {
      var h = 0;
      var m = fetchedLevel[i].voicetime;
      var isHour = true;
      while (isHour) {
        if (m >= 60) {
          m -= 60;
          h += 1;
        } else {
          isHour = false;
        }
      }
      time = `${h}h ${m}m`;
    } else {
      time = `${fetchedLevel[i].voicetime}m`;
    }
    if (version == 'XP') {
      if (i === max - 1 || i === fetchedLevel.length - 1) {
        value = `Level: ${fetchedLevel[i].level} XP: ${fetchedLevel[i].allxp}\n Nachrichten: ${fetchedLevel[i].messages} Voice Zeit: ${time}`;
      } else {
        value = `Level: ${fetchedLevel[i].level} XP: ${fetchedLevel[i].allxp}\n Nachrichten: ${fetchedLevel[i].messages} Voice Zeit: ${time}\n--------------------------------------`;
      }
    } else if (version === 'Voice') {
      value = `Voice Zeit: ${time} Voice XP: ${fetchedLevel[i].voicexp}`;
    } else if (version === 'Messages') {
      value = `Nachrichten: ${fetchedLevel[i].messages} Nachrichten XP: ${fetchedLevel[i].messagexp}`;
    }
    embed.addFields({ name: `#${i + 1}  ${userObj.user.username}`, value: value });
  }
  return embed;
}

module.exports = createLeaderboardEmbeds;