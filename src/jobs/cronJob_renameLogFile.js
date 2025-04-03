const cron = require('node-cron');
const fs = require('fs');

let renameLogFileJob = null;

function startRenameLogFileJob(client) {
    if (renameLogFileJob) {
        console.log('RenameLogFile-Job is already running.');
        return;
    }
    renameLogFileJob = cron.schedule('58 23 * * *', async function () {
        console.log(`RenameLogFile-Job started...`);
        if (fs.existsSync("./logs/bot.log")) {
            var d = new Date();
            var newFilename = `./logs/bot.log${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`;
            fs.rename('./logs/bot.log', newFilename, function (err) {
                if (err) throw err;
            });
        }
        console.log(`RenameLogFile-Job finished`);
    });
    console.log('RenameLogFile-Job started.');
}

function stopRenameLogFileJob() {
    if (renameLogFileJob) {
        renameLogFileJob.stop();
        renameLogFileJob = null;
        console.log('RenameLogFile-Job stopped.');
    } else {
        console.log('RenameLogFile-Job is not running.');
    }
}

function isRenameLogFileJobRunning() {
    return renameLogFileJob !== null;
}

module.exports = {
    startRenameLogFileJob,
    stopRenameLogFileJob,
    isRenameLogFileJobRunning
};

/*
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

  * = jede


  getFullYear() 	Get year as a four digit number (yyyy)
getMonth() 	Get month as a number (0-11)
getDate() 	Get day as a number (1-31)
*/