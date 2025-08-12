
const { EmbedBuilder } = require('discord.js');
const { getDaos } = require('./daos.js');
require('../sqliteModels/QuizStats.js');

async function createQuizLeaderboardEmbeds(page, client) {
  try {
    const { quizStatsDAO } = getDaos();
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const fetchedStats = await quizStatsDAO.getAllByGuild(guild.id);

    if (fetchedStats.length === 0) {
      console.log('ERROR: Niemand auf dem Server hat Level');
      return new EmbedBuilder()
        .setTitle('Fehler')
        .setDescription('Es gab einen Fehler beim Erstellen des Shops. Bitte versuche es später erneut.')
        .setColor(0xff0000);
    }
    var oldUsers = [];
    for (let j = 0; j < fetchedStats.length; j++) {
      if (!(guild.members.cache.find(m => m.id === fetchedStats[j].userId)?.id)) {
        oldUsers[oldUsers.length] = j;
      }
    }
    for (let j = 0; j < oldUsers.length; j++) {
      fetchedStats.splice(oldUsers[j] - j, 1);
    }
    fetchedStats.sort((a, b) => {
      if (a.right === b.right) {
        return a.wrong - b.wrong;
      } else {
        return b.right - a.right;
      }
    });

    var i = 0 + (page * 5);
    var max = 5 + (page * 5);
    const embed = new EmbedBuilder()
      .setTitle(`Rangliste`)
      .setDescription(`${page + 1}/${Math.ceil(fetchedStats.length / 5)}`)
      .setColor(0x0033cc);
    for (i; i < max; i++) {
      if (i === fetchedStats.length) {
        break;
      }
      let userObj = await guild.members.fetch(fetchedStats[i].userId);
      let value;
      if (i === max - 1 || i === fetchedStats.length - 1) {
        value = `Richtig: ${fetchedStats[i].right} Falsch: ${fetchedStats[i].wrong}\n Letzte Teilnahme: ${fetchedStats[i].lastParticipation}`;
      } else {
        value = `Richtig: ${fetchedStats[i].right} Falsch: ${fetchedStats[i].wrong}\n Letzte Teilnahme: ${fetchedStats[i].lastParticipation}\n--------------------------------------`;
      }
      embed.addFields({ name: `#${i + 1}  ${userObj.user.username}`, value: value });
    }
    return embed;
  } catch (error) {
    console.error('Error creating leaderboard embeds:', error);
    return new EmbedBuilder()
      .setTitle('Fehler')
      .setDescription('Es gab einen Fehler beim Erstellen der Rangliste. Bitte versuche es später erneut.')
      .setColor(0xff0000);
  }
}

module.exports = createQuizLeaderboardEmbeds;