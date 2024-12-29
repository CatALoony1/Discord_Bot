const Bump = require("../../models/Bump");
require('dotenv').config();

module.exports = async (message) => {
  if (message.author.id === process.env.DISBOARD_ID) {
    if (message.embeds[0] != null && message.embeds[0].description.includes("Bump erfolgreich")) {
      const query = {
        guildId: message.guild.id,
      };
      try {
        const bumpEntry = await Bump.findOne(query);
        if (bumpEntry) {
          bumpEntry.endTime = Date.now() + 7200000;
          bumpEntry.reminded = 'N';
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