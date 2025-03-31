const { MessageFlags } = require('discord.js');
const rolenames = ['DMs open',
  'DMs closed'];

module.exports = async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'dmselect') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (interaction.member.roles.cache.some(role => role.name === interaction.values[0])) {
        await interaction.editReply(`Du besitzt die DM-Rolle ${interaction.values[0]} bereits.`);
        return;
      }
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
        }
      }
      const role = interaction.guild.roles.cache.find(role => role.name === interaction.values[0]);
      await interaction.guild.members.cache.get(interaction.member.id).roles.add(role);
      console.log(`Role ${interaction.values[0]} was given to user ${interaction.member.user.tag}`);
      await interaction.editReply(`Die DM-Rolle ${interaction.values[0]} wurde dir zugewiesen.`);
    }
  }
  else if (interaction.isButton()) {
    if (interaction.customId == 'removeDm') {
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
          await interaction.editReply(`Die DM-Rolle ${rolenames[i]} wurde dir entzogen.`);
          return;
        }
      }
      await interaction.editReply(`Du hattest gar keine DM-Rolle.`);

    }
  }
};