const rolenames = ['He/him',
  'She/her',
  'They/them'];

module.exports = async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'pronounselect') {
      var addedRoles = [];
      var removedRoles = [];
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
        };
      }
      if (addedRoles.length != 0 && removedRoles.length != 0) {
        await interaction.reply({ content: `Die Pronomen ${addedRoles} wurde dir zugewiesen.\nDie Pronomen ${removedRoles} wurde entfernt.`, ephemeral: true });
      } else if (addedRoles.length != 0) {
        await interaction.reply({ content: `Die Pronomen ${addedRoles} wurde dir zugewiesen.`, ephemeral: true });
      } else if (removedRoles.length != 0) {
        await interaction.reply({ content: `Die Pronomen ${removedRoles} wurde entfernt.`, ephemeral: true });
      } else {
        await interaction.reply({ content: `Du besitzt alle Rollen die du ausgewählt hast.`, ephemeral: true });
      }
    }
  }
  else if (interaction.isButton()) {
    if (interaction.customId == 'removePronouns') {
      var removedRoles = [];
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
          removedRoles[removedRoles.length] = rolenames[i];
        }
      }
      if (removedRoles.length != 0) {
        await interaction.reply({ content: `Die Pronomen ${removedRoles} wurde entfernt.`, ephemeral: true });
      } else {
        await interaction.reply({ content: `Du hattest gar keine Pronomen-Rolle.`, ephemeral: true });
      }
    }
  }
};