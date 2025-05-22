const { ActivityType, Client } = require('discord.js');
const cron = require('node-cron');
require('dotenv').config();
let status = [
  /*{
    activities: [{
      name: 'Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=ZIo-ChHy4iU'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'mehr Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=iTMsblGTAdM'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'noch mehr Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=2Qt_182NE_M'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Popeye\'s liebster',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=vN_ptzsm6fw'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Eigenwerbung ohne Ende',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=4w6AvoRjP0w'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Zu viel Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=e2EL8WE5IFo'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Eigenwerbung bringt Geld',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=agG7VwGULnI'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Werbebudget wird genutzt',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=IYSCGAhp7HA'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Früher war Eigenwerbung besser',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=jfxbhbAIoGg'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Sci-Fi Eigenwerbung',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=1zRI-dKrcSY'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Mein eigener Song',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=FK-YmV1eVaU'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Serverhymne',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=k0jvsZ6HQOM'
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Kochen mit dem Captain',
      type: ActivityType.Streaming,
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Fischstäbchen-Verkostung',
      type: ActivityType.Streaming,
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
      name: 'der Crew zu',
      type: ActivityType.Watching
    }], status: 'idle'
  },
  {
    activities: [{
      name: 'das 1x1 der Fischstäbchen',
      type: ActivityType.Watching
    }], status: 'online'
  },
  {
    activities: [{
      name: 'rechnen lernen mit Fischstäbchen',
      type: ActivityType.Watching
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Fischstäbchen für dummies',
      type: ActivityType.Watching
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Unterwasserdokumentation',
      type: ActivityType.Watching
    }], status: 'online'
  },
  {
    activities: [{
      name: 'dir',
      type: ActivityType.Listening
    }], status: 'idle'
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
      name: 'beim Braten',
      type: ActivityType.Listening
    }], status: 'idle'
  },
  {
    activities: [{
      name: 'dem Rauschen der Wellen',
      type: ActivityType.Listening
    }], status: 'idle'
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
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'mit deinen Geschmacksnerven',
      type: ActivityType.Playing
    }], status: 'online'
  },
  {
    activities: [{
      name: 'cooking simulator',
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
      name: 'Plündert ein Handelsschiff',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Zu viel Rum getrunken',
      type: ActivityType.Custom
    }], status: 'idle'
  },
  {
    activities: [{
      name: 'Snackt Limetten🍋‍🟩',
      type: ActivityType.Custom
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Wartet auf das Essen',
      type: ActivityType.Custom
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Poliert seine Gabel',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Schärft sein Messer',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Vernichtet Konkurrenzprodukte',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Überprüft die Panadendicke',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Beschützt die Geheimformel',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Testet neue Rezepte',
      type: ActivityType.Custom
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Erhöht die Preise',
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
  {
    activities: [{
      name: 'Segelboot-Rennen',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Angelturnier',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Schatzsuche',
      type: ActivityType.Competing
    }], status: 'dnd'
  },*/
  {
    activities: [{
      name: 'kreativ sein',
      type: ActivityType.Playing
    }], status: 'online'
  },
  {
    activities: [{
      name: 'Status ausdenken',
      type: ActivityType.Competing
    }], status: 'dnd'
  },
  {
    activities: [{
      name: 'Kommt noch',
      type: ActivityType.Custom
    }], status: 'online'
  },
];

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let customStatusJob = null;

function startJob(client) {
  if (customStatusJob) {
    console.log('CustomStatus-Job is already running.');
    return;
  }
  customStatusJob = cron.schedule('*/30 * * * * *', async function () { //30sec
    try {
      await client.user.setPresence(status[getRandom(0, status.length - 1)]);
    } catch (error) {
      console.log(error);
    }
  });
  console.log('CustomStatus-Job started.');
}

function stopJob() {
  if (customStatusJob) {
    customStatusJob.stop();
    customStatusJob = null;
    console.log('CustomStatus-Job stopped.');
  } else {
    console.log('CustomStatus-Job is not running.');
  }
}

function isRunning() {
  return customStatusJob !== null;
}

module.exports = {
  startJob,
  stopJob,
  isRunning
};