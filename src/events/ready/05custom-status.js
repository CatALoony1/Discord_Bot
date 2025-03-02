const { ActivityType } = require('discord.js');
const cron = require('node-cron');
let status = [
  {
    activities: [{
      name: 'Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=ZIo-ChHy4iU'
    }], status: 'idle',
    afk: true
  },
  {
    activities: [{
      name: 'mehr Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=iTMsblGTAdM'
    }], status: 'idle',
    afk: false
  },
  {
    activities: [{
      name: 'Serverhymne',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=k0jvsZ6HQOM'
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Fisch',
      type: ActivityType.Watching
    }], status: 'online'
  },
  {
    activities: [{
      name: 'in die Ferne',
      type: ActivityType.Watching
    }], status: 'online'
  },
  {
    activities: [{
      name: 'dir',
      type: ActivityType.Listening
    }], status: 'invisible'
  },
  {
    activities: [{
      name: 'dem Nixengesang',
      type: ActivityType.Listening
    }], status: 'idle'
  },
  {
    activities: [{
      name: 'Seemannsliedern',
      type: ActivityType.Listening
    }], status: 'online'
  },
  {
    activities: [{
      name: 'alleine',
      type: ActivityType.Playing
    }], status: 'online'
  },
  {
    activities: [{
      name: 'das Angelspiel',
      type: ActivityType.Playing
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Ahoi Brause',
      type: ActivityType.Custom
    }], status: 'online'
  },
  {
    activities: [{
      name: '🐙',
      type: ActivityType.Custom
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Sucht das One Piece',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Schiffe versenken',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Fischstäbchen essen',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
];

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = (client) => {
  cron.schedule('*/1 * * * *', async function () {
    const number = getRandom(0, status.length - 1);
    client.user.setPresence(status[number]);
  });
};