const { SlashCommandBuilder, AttachmentBuilder, InteractionContextType } = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../utils/calculateLevelXp');
const gifToPngDataUri = require('../utils/gifToPngDataUri');
const { levelDAO } = require('../events/ready/02_database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Zeigt das Level.')
    .addUserOption(option =>
      option.setName('nutzer')
        .setDescription('Nutzer dessen Level dich interessiert')
    )
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }

    await interaction.deferReply();
    const mentionedUserId = interaction.options.get('nutzer')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
      interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
      return;
    }
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await levelDAO.getOneByUserAndGuild(targetUserId, interaction.guild.id);

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} hat noch kein Level`
          : "Du hast noch kein Level"
      );
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
    var status = 'offline';
    if (targetUserObj.presence) {
      status = targetUserObj.presence.status;
    }
    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
    const imgUrl = await gifToPngDataUri(targetUserObj.user.displayAvatarURL({ size: 256 }));
    const rank = new canvacord.RankCardBuilder()
      .setAvatar(imgUrl)
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setStatus(status)
      .setDisplayName(targetUserObj.user.displayName)
      .setOverlay(80)
      .setBackground('./img/banner.png')
      //.setBackground('#7DC9D1')
      .setFonts(canvacord.Font.loadDefault())
      .setStyles({
        progressbar: {
          thumb: {
            style: {
              backgroundColor: fetchedLevel.color,
            },
          },
        },
      })
      ;

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },
};