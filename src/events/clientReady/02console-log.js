require('dotenv').config();
module.exports = {
  once: true,

  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
      let targetUser = undefined;
      const guilds = await client.guilds.fetch();
      let message = `Bot ist gestartet.\nDer Bot ist laut API auf ${guilds.size} Server(n):\n`;
      guilds.forEach(async (guild) => {
        if (!targetUser) {
          targetUser = await guild.members.fetch(process.env.ADMIN_ID);
        }
        message = `${message}- ${guild.name} (ID: ${guild.id})`;
      });
      targetUser.send(message);
    } catch (error) {
      console.log(error);
    }
  },
};
