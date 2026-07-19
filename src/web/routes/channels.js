const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Hier holen wir uns den Client, den wir in der website.js an 'req' gehängt haben!
  const client = req.discordClient;

  // Alle Server (Guilds) holen, auf denen der Bot ist
  const servers = client.guilds.cache.map((guild) => ({
    id: guild.id,
    name: guild.name,
  }));

  // Prüfen, ob in der URL ein Server ausgewählt wurde (z.B. /kanaele?serverId=12345)
  const selectedServerId = req.query.serverId;
  let channels = [];

  // Wenn eine ID da ist, holen wir die Kanäle von genau diesem Server
  if (selectedServerId) {
    const selectedGuild = client.guilds.cache.get(selectedServerId);
    if (selectedGuild) {
      channels = selectedGuild.channels.cache.map((channel) => ({
        id: channel.id,
        name: channel.name,
        // Zur Info, ob es ein Text- (0) oder Voice-Channel (2) ist
        type: channel.type,
      }));
    }
  }

  // Alles an das HTML-Template übergeben
  res.render('channels', {
    servers: servers,
    selectedServerId: selectedServerId,
    channels: channels,
  });
});

module.exports = router;
