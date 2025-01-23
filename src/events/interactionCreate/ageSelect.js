require('dotenv').config();
const rolenames = ['18-21',
  '22-25',
  '26-29',
  'Ü 30'];

module.exports = async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == 'ageselect') {
      if (interaction.values[0] === '<18') {
        try {
          console.log('ERROR Test');
          const usertag = interaction.member.user.tag;
          interaction.member.ban('Server ist ab 18');
          await interaction.deferUpdate();
          const targetChannel = newMessage.guild.channels.cache.get(process.env.LOG_ID) || (await newMessage.guild.channels.fetch(process.env.LOG_ID));
          await targetChannel.send(`${usertag} gebannt, da der Server ab 18 ist.`);
          return;
        } catch (error) {
          console.log(error);
        }
      } else {
        if (interaction.member.roles.cache.some(role => role.name === interaction.values[0])) {
          await interaction.reply({ content: `Du besitzt das Alter ${interaction.values[0]} bereits.`, ephemeral: true });
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
        await interaction.reply({ content: `Das Alter ${interaction.values[0]} wurde dir zugewiesen.`, ephemeral: true });
      }
    }
    else if (interaction.isButton()) {
      if (interaction.customId == 'removeAge') {
        for (let i = 0; i < rolenames.length; i++) {
          if (interaction.member.roles.cache.some(role => role.name === rolenames[i])) {
            let tempRole = interaction.guild.roles.cache.find(role => role.name === rolenames[i]);
            await interaction.guild.members.cache.get(interaction.member.id).roles.remove(tempRole);
            console.log(`Role ${rolenames[i]} was removed from user ${interaction.member.user.tag}`);
            await interaction.reply({ content: `Das Alter ${rolenames[i]} wurde dir entzogen.`, ephemeral: true });
            return;
          }
        }
        await interaction.reply({ content: `Du hattest gar keine Altersrolle.`, ephemeral: true });
      }
    }
  }
};