const { SlashCommandBuilder, AttachmentBuilder, InteractionContextType } = require('discord.js');
const canvacord = require('canvacord');
const Level = require('../models/Level');
const gifToPngDataUri = require('../utils/gifToPngDataUri');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top5')
    .setDescription('Zeigt die top 5 an.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }
    await interaction.deferReply();
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
    fetchedLevel.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });
    var players = [];
    for (let i = 0; i < fetchedLevel.length; i++) {
      if (i === 5) break;
      let userObj = await interaction.guild.members.fetch(fetchedLevel[i].userId);
      const imgUrl = await gifToPngDataUri(userObj.user.displayAvatarURL({ size: 256 }));
      players[i] = {
        avatar: imgUrl,
        username: userObj.user.tag,
        displayName: userObj.user.displayName,
        level: fetchedLevel[i].level,
        xp: fetchedLevel[i].allxp,
        rank: i + 1,
      };
    }
    canvacord.Font.loadDefault();
    const lb = new canvacord.LeaderboardBuilder()
      .setHeader({
        title: `Top 5`,
        image: interaction.guild.iconURL({ size: 256 }),
      })
      .setPlayers(players)
      //.setBackground('./img/captain.png')
      .setBackground('./img/top5.png')
      .setVariant('default');
    const image = await lb.build({ format: "png" });
    const attachment = new AttachmentBuilder(image);
    interaction.editReply({ files: [attachment] });
  },
  options: {
        devOnly: false,
        deleted: true
    },
};