const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('../utils/calculateLevelXp');
const { getDaos } = require('../utils/daos');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Zeigt all deine Level-Bezogenen Daten.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const { levelDAO, lottozahlenDAO } = getDaos();
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }

    await interaction.deferReply();
    const targetUserId = interaction.member.id;
    const fetchedLevel = await levelDAO.getOneByUserAndGuild(targetUserId, interaction.guild.id);

    if (!fetchedLevel) {
      interaction.editReply("Du hast noch kein Level");
      return;
    }

    let allLevels = await levelDAO.getAllByGuild(interaction.guild.id);

    var oldUsers = [];
    for (let j = 0; j < allLevels.length; j++) {
      if (!(interaction.guild.members.cache.find(m => m.id === allLevels[j].userId)?.id)) {
        oldUsers[oldUsers.length] = j;
      }
    }
    for (let j = 0; j < oldUsers.length; j++) {
      allLevels.splice(oldUsers[j] - j, 1);
    }

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });
    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
    var time;
    if (fetchedLevel.voicetime >= 60) {
      var h = 0;
      var m = fetchedLevel.voicetime;
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
      time = `${fetchedLevel.voicetime}m`;
    }
    var lottospiele = await lottozahlenDAO.countByUserAndGuild(targetUserId, interaction.guild.id);
    const messageEdited = new EmbedBuilder();
    messageEdited.setColor(0x0033cc);
    messageEdited.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({ size: 256 }) });
    messageEdited.setTitle(`Deine Stats:`);
    messageEdited.addFields({ name: 'Rang:', value: `${currentRank}` });
    messageEdited.addFields({ name: 'Level:', value: `${fetchedLevel.level}` });
    messageEdited.addFields({ name: 'XP zum nächsten Level:', value: `${fetchedLevel.xp}/${calculateLevelXp(fetchedLevel.level)}` });
    messageEdited.addFields({ name: 'Gesamte XP:', value: `${fetchedLevel.allxp}` });
    messageEdited.addFields({ name: 'XP diesen Monat:', value: `${fetchedLevel.thismonth}` });
    messageEdited.addFields({ name: 'XP letzten Monat:', value: `${fetchedLevel.lastmonth}` });
    messageEdited.addFields({ name: 'Nachrichten XP:', value: `${fetchedLevel.messagexp}` });
    messageEdited.addFields({ name: 'Voice Call XP:', value: `${fetchedLevel.voicexp}` });
    messageEdited.addFields({ name: 'Nachrichten:', value: `${fetchedLevel.messages}` });
    messageEdited.addFields({ name: 'Ungefähre Voice Call Zeit:', value: `${time}` });
    messageEdited.addFields({ name: 'Anzahl Lottospiele:', value: `${lottospiele}` });
    messageEdited.addFields({ name: 'Anzahl Bumps:', value: `${fetchedLevel.bumps}` });
    messageEdited.addFields({ name: 'Letzte XP:', value: `${fetchedLevel.lastMessage}` });
    messageEdited.addFields({ name: 'Geburtstag:', value: `${fetchedLevel.geburtstag}` });
    messageEdited.addFields({ name: 'Levelbarfarbe:', value: `${fetchedLevel.color}` });

    interaction.editReply({ embeds: [messageEdited] });
  },
};