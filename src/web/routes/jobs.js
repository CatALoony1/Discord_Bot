const express = require('express');
const router = express.Router();
const jobMap = {
  bumpReminderJob: require('../../jobs/cronJob_bumpReminder'),
  checkBumperRoleJob: require('../../jobs/cronJob_checkBumperRole'),
  checkInactiveJob: require('../../jobs/cronJob_checkInactive'),
  customStatusJob: require('../../jobs/cronJob_customStatus'),
  geburtstagJob: require('../../jobs/cronJob_geburtstag'),
  monthlyXPJob: require('../../jobs/cronJob_monthlyXP'),
  newYearJob: require('../../jobs/cronJob_newYear'),
  quizQuestionJob: require('../../jobs/cronJob_quizQuestion'),
  quizStatsJob: require('../../jobs/cronJob_quizStats'),
  renameLogFileJob: require('../../jobs/cronJob_renameLogFile'),
  voiceXPJob: require('../../jobs/cronJob_voiceXp'),
  missingXpJob: require('../../jobs/cronJob_checkMissingXP'),
  checkNewAnimalsJob: require('../../jobs/checkNewAnimals'),
  zinsenJob: require('../../jobs/cronJob_zinsen'),
  checkActiveItemsJob: require('../../jobs/cronJob_checkActiveItems'),
  checkVoiceChannelsJob: require('../../jobs/cronJob_checkVoicechannels'),
};

router.get('/', (req, res) => {
  if (req.session.guildIds !== 'all') {
    req.session.message = 'Du bist dazu nicht berechtigt!';
    return res.redirect('/');
  }
  const alleJobs = Object.entries(jobMap).map(([jobname, modul]) => ({
    jobname: jobname,
    status: modul.isRunning,
  }));
  res.render('jobs', {
    alleJobs: alleJobs,
    error: null,
  });
});

router.post('/start', (req, res) => {
  const client = req.discordClient;
  const { jobname } = req.body;
  jobMap[jobname].startJob(client);
  res.redirect('/jobs');
});

router.post('/stop', (req, res) => {
  const client = req.discordClient;
  const { jobname } = req.body;
  jobMap[jobname].stopJob(client);
  res.redirect('/jobs');
});

router.post('/execute', async (req, res) => {
  const client = req.discordClient;
  const { jobname } = req.body;
  await jobMap[jobname].jobFunction(client);
  res.redirect('/jobs');
});

router.post('/all', async (req, res) => {
  const client = req.discordClient;
  const { action } = req.body;
  if (action === 'start') {
    for (const [jobname, job] of Object.entries(jobMap)) {
      if (jobname !== 'checkNewAnimals') {
        job.startJob(client);
      }
    }
  } else {
    for (const [jobname, job] of Object.entries(jobMap)) {
      if (jobname !== 'checkNewAnimals') {
        job.stopJob(client);
      }
    }
  }
  res.redirect('/jobs');
});

module.exports = router;
