require('dotenv').config();
module.exports = async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  try {
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    const targetUser = await guild.members.fetch(process.env.ADMIN_ID);
    targetUser.send(`Bot ist gestartet.`);
  } catch (error) {
    console.log(error);
  }
};
