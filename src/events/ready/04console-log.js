require('dotenv').config();
module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    const targetUser = await interaction.guild.members.fetch(process.env.ADMIN_ID);
    targetUser.send(`Bot ist gestartet.`);
};