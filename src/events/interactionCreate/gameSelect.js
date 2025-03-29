const { MessageFlags } = require('discord.js');
const rolenames = ['League of Legends',
  'Minecraft',
  'Dead by Daylight',
  'Fortnite',
  'Overwatch',
  'Call of Duty',
  'Garry\'s Mod'];

module.exports = async (interaction) => {
  var removedRoles = [];
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'gameselect') {
      var addedRoles = [];
      if (interaction.values.length == 0) {
        for (let i = 0; i < rolenames.length; i++) {
          if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
            let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
            await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
            console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
            removedRoles[removedRoles.length] = rolenames[i];
          }
        }
      } else {
        for (let j = 0; j < rolenames.length; j++) {
          if (interaction.values.includes(rolenames[j])) {
            if (!interaction.member.roles.cache.some(role => role.name === rolenames[j])) {
              const role = interaction.guild.roles.cache.find(role => role.name === rolenames[j]);
              await interaction.guild.members.cache.get(interaction.member.id).roles.add(role);
              console.log(`Role ${rolenames[j]} was given to user ${interaction.member.user.tag}`);
              addedRoles[addedRoles.length] = rolenames[j];
            }
          } else if (interaction.member.roles.cache.some(role => role.name === rolenames[j])) {
            let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[j]);
            await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
            console.log(`Role ${rolenames[j]} was removed from user ${interaction.member.user.tag}`);
            removedRoles[removedRoles.length] = rolenames[j];
          }
        }
      }
      if (addedRoles.length != 0 && removedRoles.length != 0) {
        await interaction.reply({ content: `Die Spiele ${addedRoles} wurde dir zugewiesen.\nDie Spiele ${removedRoles} wurde entfernt.`, flags: MessageFlags.Ephemeral });
      } else if (addedRoles.length != 0) {
        await interaction.reply({ content: `Die Spiele ${addedRoles} wurde dir zugewiesen.`, flags: MessageFlags.Ephemeral });
      } else if (removedRoles.length != 0) {
        await interaction.reply({ content: `Die Spiele ${removedRoles} wurde entfernt.`, flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: `Du besitzt alle Rollen die du ausgewählt hast.`, flags: MessageFlags.Ephemeral });
      }
    }
  }
  else if (interaction.isButton()) {
    if (interaction.customId == 'removeGames') {
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
          removedRoles[removedRoles.length] = rolenames[i];
        }
      }
      if (removedRoles.length != 0) {
        await interaction.reply({ content: `Die Spiele ${removedRoles} wurde entfernt.`, flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: `Du hattest gar keine Spiele-Rolle.`, flags: MessageFlags.Ephemeral });
      }
    }
  }
};