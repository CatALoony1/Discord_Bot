const Bump = require("../../sqliteModels/Bump");
require('dotenv').config();
const { Message, EmbedBuilder } = require('discord.js');
const { getDaos } = require('../../utils/daos');

/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
  if (message.author.id === process.env.DISBOARD_ID) {
    const { bumpDAO, levelDAO } = getDaos();
    if (message.embeds[0] != null && message.embeds[0].description.includes("Bump erfolgreich")) {
      const userid = message.interactionMetadata.user.id;
      const guildId = message.guild.id;
      const channel = message.channel;
      const level = await levelDAO.getOneByUserAndGuild(userid, guildId);
      var newMessage = undefined;
      const member = await message.guild.members.fetch(userid);
      if (level) {
        level.lastBump = new Date();
        level.bumps += 1;
        await levelDAO.update(level);
        if (!member.roles.cache.some(role => role.name === 'Bumper')) {
          const role = message.guild.roles.cache.find(role => role.name === 'Bumper');
          await member.roles.add(role);
        }
        const embed = new EmbedBuilder()
          .setTitle('Dankeschön für deine Untersützung!❤️')
          .setDescription(`Danke <@${userid}>, dass du den Server gebumpt hast. Um unsere Dankbarkeit zu zeigen bekommst du für 24 Stunden die Rolle **Bumper**, durch diese Rolle erhälst du einen Bonus von 10% auf jegliche erhaltene Erfahrung und 15% auf jegliche Blattläuse!`)
          .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
          .setColor(0x0033cc);
        newMessage = await channel.send({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle('Dankeschön für deine Untersützung!❤️')
          .setDescription(`Danke <@${userid}>, dass du den Server gebumpt hast. Ohne je eine Nachricht geschrieben zu haben, können wir dir keinen Bonus geben. Schreibe eine Nachricht um beim nächsten mal einen Bonus zu erhalten!`)
          .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
          .setColor(0x0033cc);
        newMessage = await channel.send({ embeds: [embed] });
      }
      var messageToReact = undefined;
      if (newMessage != undefined) {
        messageToReact = newMessage;
        await message.delete();
      } else {
        messageToReact = message;
      }
      try {
        const bumpEntry = await bumpDAO.getOneByGuild(guildId);
        if (bumpEntry) {
          bumpEntry.endTime = new Date(Date.now() + 7200000);
          bumpEntry.reminded = 'N';
          if (bumpEntry.remindedId) {
            const remindedmessage = await channel.messages.fetch(bumpEntry.remindedId);
            await remindedmessage.delete();
            bumpEntry.remindedId = undefined;
          }
          await bumpDAO.update(bumpEntry);
          console.log('Bump entry updated');
          messageToReact.react("⏰");
        } else {
          const newBump = new Bump();
          newBump.setGuildId(guildId);
          newBump.setEndTime(new Date(Date.now() + 7200000));
          await bumpDAO.insert(newBump);
          console.log('Bump entry created');
          messageToReact.react("⏰");
        }
      } catch (error) {
        messageToReact.reply('Fehler bei erstellen des Bump Reminders.');
        console.log(error);
      }
    }
  }
};