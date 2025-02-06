const { MessageFlags } = require('discord.js');
const rolenames = ['Niedersachsen',
  'Bayern',
  'Berlin',
  'Hessem',
  'Thüringen',
  'Bremen',
  'Baden-Württemberg',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Mecklenburg-Vorpommern',
  'Brandenburg',
  'Schleswig-Holstein',
  'Nordrhein-Westfalen',
  'Hamburg',
  'Rheinland-Pfalz'];

module.exports = async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'regionselect') {
      if (interaction.member.roles.cache.some(role => role.name === interaction.values[0])) {
        await interaction.reply({ content: `Du besitzt das Bundesland ${interaction.values[0]} bereits.`, flags: MessageFlags.Ephemeral });
        return;
      };
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
      await interaction.reply({ content: `Das Bundesland ${interaction.values[0]} wurde dir zugewiesen.`, flags: MessageFlags.Ephemeral });
    }
  }
  else if (interaction.isButton()) {
    if (interaction.customId == 'removeRegion') {
      for (let i = 0; i < rolenames.length; i++) {
        if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
          let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
          await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
          console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
          await interaction.reply({ content: `Das Bundesland ${rolenames[i]} wurde dir entzogen.`, flags: MessageFlags.Ephemeral });
          return;
        }
      }
      await interaction.reply({ content: `Du hattest gar keine Bundeslandrolle.`, flags: MessageFlags.Ephemeral });

    }
  }
};