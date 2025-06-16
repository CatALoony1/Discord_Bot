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
    try {
        var targetChannel = await client.channels.fetch(process.env.LOG_ID);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        const fetch = await import('node-fetch').then(module => module.default);
        let matchID;
        const fetchMatchesURL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${process.env.KIRA_L_PUUID}/ids?start=0&count=1&api_key=${process.env.LEAGUE_API}`;
        await fetch(fetchMatchesURL)
            .then((response) => response.json())
            .then((mydata) => {
                matchID = mydata;
            });
        console.log(matchID[0]);
        let matchData;
        const fetchMatchURL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchID[0]}?api_key=${process.env.LEAGUE_API}`;
        await fetch(fetchMatchesURL)
            .then((response) => response.json())
            .then((mydata) => {
                matchData = mydata;
            });
        console.log(matchData);
        let userMatchData;
        for (const user of matchData.info.participants) {
            if (user.puuid && user.puuid == process.env.KIRA_L_PUUID) {
                userMatchData = user;
            }
        }
        console.log(userMatchData);
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    startJob,
    stopJob,
    isRunning,
    jobFunction
};