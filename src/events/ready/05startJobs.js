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
    bumpReminderJob.startJob(client);
    checkBumperRoleJob.startJob(client);
    checkGoodEvilJob.startJob(client);
    checkInactiveJob.startJob(client);
    customStatusJob.startJob(client);
    geburtstagJob.startJob(client);
    goodMorningJob.startJob(client);
    monthlyXPJob.startJob(client);
    newYearJob.startJob(client);
    quizQuestionJob.startJob(client);
    quizStatsJob.startJob(client);
    renameLogFileJob.startJob(client);
    console.log(`Jobs started...`);
};