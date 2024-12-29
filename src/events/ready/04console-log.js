module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    var targetChannel = await client.channels.fetch(process.env.BUMP_ID);
    targetChannel.send(`Bot ist gestartet.`);
};