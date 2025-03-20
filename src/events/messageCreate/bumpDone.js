const Bump = require("../../models/Bump");
const Level = require("../../models/Level");
require('dotenv').config();
const { Message, EmbedBuilder } = require('discord.js');
/**
 * 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (message) => {
  if (message.author.id === process.env.DISBOARD_ID) {
    if (message.embeds[0] != null && message.embeds[0].description.includes("Bump erfolgreich")) {
      const userid = message.interactionMetadata.user.id;
      const level = await Level.findOne({
        userId: userid,
        guildId: message.guild.id,
      });
      if (level) {
        level.lastBump = new Date();
        level.save();
        const member = await message.guild.members.fetch(userid);
        if (!member.roles.cache.some(role => role.name === 'Bumper')) {
          const role = message.guild.roles.cache.find(role => role.name === 'Bumper');
          await member.roles.add(role);
        };
        const embed = new EmbedBuilder()
          .setTitle('❤️Dankeschön für deine Untersützung!❤️')
          .setDescription(`Danke <@${userid}>, dass du den Server gebumpt hast. Um unsere Dankbarkeit zu zeigen bekommst du für 24 Stunden die Rolle **Bumper**, durch diese Rolle erhälst du einen Bonus von 10% auf jegliche erhaltene Erfahrung!`)
          .setImage(targetUserObj.user.displayAvatarURL({ format: 'png', dynamic: true }))
          .setColor(0x0033cc);
        message.channel.send({ embeds: [embed] });
      }
      const query = {
        guildId: message.guild.id,
      };
      try {
        const bumpEntry = await Bump.findOne(query);
        if (bumpEntry) {
          bumpEntry.endTime = Date.now() + 7200000;
          bumpEntry.reminded = 'N';
          if (bumpEntry.remindedId) {
            remindedmessage = await message.channel.messages.fetch(bumpEntry.remindedId);
            await remindedmessage.delete();
            bumpEntry.remindedId = undefined;
          }
          bumpEntry.save();
          console.log('Bump entry updated');
          message.react("⏰");
        } else {
          const newBump = new Bump({
            guildId: message.guild.id,
            endTime: Date.now() + 7200000,
          });
          await newBump.save();
          console.log('Bump entry created');
          message.react("⏰");
        }
      } catch (error) {
        message.reply('Fehler bei erstellen des Bump Reminders.');
        console.log(error);
      }
    }
  }
};