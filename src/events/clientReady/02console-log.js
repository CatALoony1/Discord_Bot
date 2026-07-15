require('dotenv').config();
module.exports = {
  once: true,

  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
      const guild = await client.guilds.cache.get(process.env.GUILD_ID);
      const targetUser = await guild.members.fetch(process.env.ADMIN_ID);
      targetUser.send(`Bot ist gestartet.`);
      client.guilds.cache.forEach((guild) => {
        targetUser.send(`- ${guild.name} (ID: ${guild.id})`);
      });
    } catch (error) {
      console.log(error);
    }
  },
};
