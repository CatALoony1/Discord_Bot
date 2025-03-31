const { MessageFlags } = require('discord.js');
require('dotenv').config();
const rolenames = ['18-21',
  '22-25',
  '26-29',
  'Ü 30'];

module.exports = async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'ageselect') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (interaction.values[0] === '<18') {
        try {
          const usertag = interaction.member.user.tag;
          await interaction.member.user.send('Du wurdest gebannt, da der Server ab 18 ist.');
          await interaction.member.ban({ reason: 'Server ist ab 18' });
          await interaction.deferUpdate();
          const targetChannel = interaction.guild.channels.cache.get(process.env.LOG_ID) || (await interaction.guild.channels.fetch(process.env.LOG_ID));
          await targetChannel.send(`${usertag} gebannt, da der Server ab 18 ist.`);
          return;
        } catch (error) {
          console.log(error);
        }
      } else {
        if (interaction.member.roles.cache.some(role => role.name === interaction.values[0])) {
          await interaction.editReply(`Du besitzt das Alter ${interaction.values[0]} bereits.`);
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
        await interaction.editReply(`Das Alter ${interaction.values[0]} wurde dir zugewiesen.`);
      }
    }
    else if (interaction.isButton()) {
      if (interaction.customId == 'removeAge') {
        for (let i = 0; i < rolenames.length; i++) {
          if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
            let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
            await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
            console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
            await interaction.editReply(`Das Alter ${rolenames[i]} wurde dir entzogen.`);
            return;
          }
        }
        await interaction.editReply(`Du hattest gar keine Altersrolle.`);
      }
    }
  }
};