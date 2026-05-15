module.exports = {
  once: true,

  run: async (client) => {
    console.log(`Caching message`);
    try {
      const channel = await client.channels.fetch('1387026261196673184');
      await channel.messages.fetch('1388806068880019478');
      targetUser.send(`Message cached`);
    } catch (error) {
      console.log(error);
    }
  },
};
