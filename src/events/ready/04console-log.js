require('dotenv').config();
module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    const targetUser = await guild.members.fetch(process.env.ADMIN_ID);
    const message = await targetUser.send(`Bot ist gestartet.`);
    message.reply({ files: ['./img/NEIN_BOOT.jpg'] });
    
};