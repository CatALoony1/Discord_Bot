require('dotenv').config();
const cron = require('node-cron');

let checkLeagueJob = null;

function startJob(client) {
    if (checkLeagueJob) {
        console.log('checkLeague-Job is already running.');
        return;
    }
    checkLeagueJob = cron.schedule('* * * * *', async function () {
        await jobFunction(client).catch((error) => {
            console.log(error);
        });
    });
    console.log('checkLeague-Job started.');
}

function stopJob() {
    if (checkLeagueJob) {
        checkLeagueJob.stop();
        checkLeagueJob = null;
        console.log('checkLeague-Job stopped.');
    } else {
        console.log('checkLeague-Job is not running.');
    }
}

function isRunning() {
    return checkLeagueJob !== null;
}

async function jobFunction(client) {
    var targetChannel = await client.channels.fetch(process.env.LOG_ID);
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    const fetch = await import('node-fetch').then(module => module.default);
    let data;
    const fetchMatchURL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${process.env.KIRA_L_PUUID}/ids?start=0&count=1&api_key=${process.env.LEAGUE_API}`;
    await fetch(fetchMatchURL)
        .then((response) => response.json())
        .then((mydata) => {
            data = mydata;
        });
    console.log(data);
}

module.exports = {
    startJob,
    stopJob,
    isRunning,
    jobFunction
};