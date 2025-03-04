const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('../utils/calculateLevelXp');
const Level = require('../models/Level');

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('givebonusxp')
    .setDescription('Gibt einem Nutzer Bonus XP')
    .addMentionableOption(option =>
      option.setName('nutzer')
        .setDescription('Nutzer dessen Level dich interessiert')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('xpmenge')
        .setDescription('Die Menge an XP die der Nutzer erhalten soll.')
        .setRequired(true)
        .setMaxValue(3000)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option.setName('grund')
        .setDescription('Der Grund für die Bonus XP')
        .setRequired(true)
        .setMinLength(1)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }

    await interaction.deferReply();
    const targetUserId = interaction.options.get('nutzer').value;
    if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
      interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
      return;
    }
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);
    const xpToGive = interaction.options.get('xpmenge').value;
    const reason = interaction.options.get('grund').value;
    try {
      const level = await Level.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id,
      });
      console.log(`user ${targetUserObj.user.tag} received ${xpToGive} Bonus XP (command)`);
      if (level) {
        level.xp += xpToGive;
        level.allxp += xpToGive;
        level.thismonth += xpToGive;
        level.bonusclaimed += xpToGive;
        level.lastMessage = Date.now();
        if (level.xp > calculateLevelXp(level.level)) {
          level.xp = level.xp - calculateLevelXp(level.level);
          level.level += 1;
          console.log(`user ${targetUserObj.user.tag} reached level ${level.level}`);
          let description = `🎉 Glückwunsch ${targetUserObj}! Du hast **Level ${level.level}** erreicht!⚓`;

          if (roles.has(level.level)) {
            let newRole = roles.get(level.level);
            description = `🎉 Glückwunsch ${targetUserObj}! Du hast **Level ${level.level}** erreicht und bist somit zum ${newRole} aufgestiegen!⚓`;

            for (const value of roles.values()) {
              if (targetUserObj.roles.cache.some(role => role.name === value)) {
                let tempRole = interaction.guild.roles.cache.find(role => role.name === value);
                await interaction.guild.members.cache.get(targetUserObj.id).roles.remove(tempRole);
                console.log(`Role ${value} was removed from user ${targetUserObj.user.tag}`);
              }
            }
            let role = interaction.guild.roles.cache.find(role => role.name === newRole);
            await interaction.guild.members.cache.get(targetUserObj.id).roles.add(role);
            console.log(`Role ${newRole} was given to user ${targetUserObj.user.tag}`);
            if (level.level === 1) {
              let memberRole = interaction.guild.roles.cache.find(role => role.name === 'Mitglied');
              await interaction.guild.members.cache.get(targetUserObj.id).roles.add(memberRole);
              console.log(`Role Mitglied was given to user ${targetUserObj.user.tag}`);
            }
          }

          const embed = new EmbedBuilder()
            .setTitle('Glückwunsch!')
            .setDescription(description)
            .setThumbnail(targetUserObj.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setColor(0x0033cc);
          interaction.channel.send({ embeds: [embed] });
        }
        await level.save().catch((e) => {
          console.log(`Error saving updated level ${e}`);
          return;
        });
        await interaction.editReply(`Nutzer ${targetUserObj} hat ${xpToGive} Bonus XP erhalten!\nGrund: ${reason}`);
      } else {
        console.log(`new user ${targetUserObj.user.tag} added to database`);
        const newLevel = new Level({
          userId: targetUserObj.user.id,
          guildId: interaction.guild.id,
          xp: xpToGive,
          allxp: xpToGive,
          messages: 1,
          lastMessage: Date.now(),
          userName: targetUserObj.user.tag,
          messagexp: 0,
          voicexp: 0,
          voicetime: 0,
          thismonth: xpToGive,
          bonusclaimed: xpToGive,
        });
        await newLevel.save();
        await interaction.editReply(`Nutzer ${targetUserObj} hat ${xpToGive} Bonus XP erhalten!\nGrund: ${reason}`);
      }
    } catch (error) {
      console.log(`Error giving bonus xp: ${error}`);
    }
  },
};