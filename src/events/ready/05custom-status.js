const { ActivityType } = require('discord.js');
let status = [
  {
    name: 'Eigenwerbung',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=ZIo-ChHy4iU',
  },
  {
    name: 'mehr Eigenwerbung',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=iTMsblGTAdM',
  },
  {
    name: 'Fisch',
    type: ActivityType.Watching,
  },
  {
    name: 'in die Ferne',
    type: ActivityType.Watching,
  },
  {
    name: 'dir',
    type: ActivityType.Listening,
  },
  {
    name: 'dem Nixengesang',
    type: ActivityType.Listening,
  },
  {
    name: 'alleine',
    type: ActivityType.Playing,
  },
  {
    name: 'das Angelspiel',
    type: ActivityType.Playing,
  },
  {
    name: 'Ahoi Brause',
    type: ActivityType.Custom,
  },
  {
    type: ActivityType.Custom,
    state: '🐙'
  },
  {
    name: 'Sucht das One Piece',
    type: ActivityType.Custom,
  },
  {
    name: 'Schiffe versenken',
    type: ActivityType.Competing,
  },
  {
    name: 'Fischstäbchen essen',
    type: ActivityType.Competing,
  },
];

module.exports = (client) => {
  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
};