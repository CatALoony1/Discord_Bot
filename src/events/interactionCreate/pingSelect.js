const { MessageFlags } = require('discord.js');
const rolenames = ['Begrüßungskomitee',
  'Bump-Ping',
  'Event-Ping'];

module.exports = async (interaction) => {
  var removedRoles = [];
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'pingselect') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
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
        await interaction.editReply(`Die Rollen ${addedRoles} wurde dir zugewiesen.\nDie Rollen ${removedRoles} wurde entfernt.`);
      } else if (addedRoles.length != 0) {
        await interaction.editReply(`Die Rollen ${addedRoles} wurde dir zugewiesen.`);
      } else if (removedRoles.length != 0) {
        await interaction.editReply(`Die Rollen ${removedRoles} wurde entfernt.`);
      } else {
        await interaction.editReply(`Du besitzt alle Rollen die du ausgewählt hast.`);
      }
    }
  }
  else if (interaction.isButton()) {
    if (interaction.customId == 'removePingRoles') {
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
          removedRoles[removedRoles.length] = rolenames[i];
        }
      }
      if (removedRoles.length != 0) {
        await interaction.editReply(`Die Rollen ${removedRoles} wurde entfernt.`);
      } else {
        await interaction.editReply(`Du hattest gar keine Ping-Rolle.`);
      }
    }
  }
};