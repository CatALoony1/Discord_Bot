const express = require('express');
const router = express.Router();
const Level = require('../../models/Level');

router.get('/', async (req, res) => {
  const client = req.discordClient;

  let servers = client.guilds.cache.map((guild) => ({
    id: guild.id,
    name: guild.name,
  }));
  const allowedGuilds = req.session.guildIds;
  if (allowedGuilds !== 'all') {
    const allowedIds = allowedGuilds.split(',').map((id) => id.trim());
    servers = servers.filter((server) => allowedIds.includes(server.id));
  }
  const selectedServerId = req.query.serverId;
  let users = [];
  if (
    selectedServerId &&
    (allowedGuilds.includes(selectedServerId) || allowedGuilds === 'all')
  ) {
    const allUsers = await Level.find({ guildId: selectedServerId }).lean();
    if (allUsers) {
      users = allUsers.map((user) => ({
        id: user.userId,
        name: user.userName,
        lastMessage: getDaysAgo(user.lastMessage),
        messages: user.messages,
        voiceTime: getVoiceTime(user.voicetime),
      }));
    }
  }
  res.render('user-activity', {
    servers: servers,
    selectedServerId: selectedServerId,
    users: users,
  });
});

function getDaysAgo(userDate) {
  const date = new Date(userDate);
  date.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffInMs = today - date;
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

function getVoiceTime(duration) {
  let time;
  if (duration >= 60) {
    let h = 0;
    let m = duration;
    let isHour = true;
    while (isHour) {
      if (m >= 60) {
        m -= 60;
        h += 1;
      } else {
        isHour = false;
      }
    }
    time = `${h}h ${m}m`;
  } else {
    time = `${duration}m`;
  }
  return time;
}

module.exports = router;
