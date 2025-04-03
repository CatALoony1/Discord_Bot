const bumpReminderJob = require('../../jobs/cronJob_bumpReminder');
const checkBumperRoleJob = require('../../jobs/cronJob_checkBumperRole');
const checkGoodEvilJob = require('../../jobs/cronJob_checkGoodEvil');
const checkInactiveJob = require('../../jobs/cronJob_checkInactive');
const customStatusJob = require('../../jobs/cronJob_customStatus');
const geburtstagJob = require('../../jobs/cronJob_geburtstag');
const goodMorningJob = require('../../jobs/cronJob_goodMorning');
const monthlyXPJob = require('../../jobs/cronJob_monthlyXP');
const newYearJob = require('../../jobs/cronJob_newYear');
const quizQuestionJob = require('../../jobs/cronJob_quizQuestion');
const quizStatsJob = require('../../jobs/cronJob_quizStats');
const renameLogFileJob = require('../../jobs/cronJob_renameLogFile');

module.exports = async (client) => {
    console.log(`Starting Jobs...`);
    bumpReminderJob.startBumpReminderJob(client);
    checkBumperRoleJob.startCheckBumperRoleJob(client);
    checkGoodEvilJob.startCheckGoodEvilJob(client);
    checkInactiveJob.startCheckInactiveJob(client);
    customStatusJob.startCustomStatusJob(client);
    geburtstagJob.startGeburtstagJob(client);
    goodMorningJob.startGoodMorningJob(client);
    monthlyXPJob.startMonthlyXPJob(client);
    newYearJob.startNewYearJob(client);
    quizQuestionJob.startQuizQuestionJob(client);
    quizStatsJob.startQuizStatsJob(client);
    renameLogFileJob.startRenameLogFileJob(client);
    console.log(`Jobs started...`);
};