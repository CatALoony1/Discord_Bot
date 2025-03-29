const cron = require('node-cron');
const fs = require('fs');

module.exports = async () => {
    cron.schedule('58 23 * * *', async function () {
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