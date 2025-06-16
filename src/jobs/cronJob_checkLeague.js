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
        var targetChannel = await client.channels.fetch(process.env.MESSE_ID);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        const fetch = await import('node-fetch').then(module => module.default);
        let matchID;
        const fetchMatchesURL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${process.env.KIRA_L_PUUID}/ids?start=0&count=1&api_key=${process.env.LEAGUE_API}`;
        await fetch(fetchMatchesURL)
            .then((response) => response.json())
            .then((mydata) => {
                matchID = mydata;
            });
        let matchData;
        const fetchMatchURL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchID[0]}?api_key=${process.env.LEAGUE_API}`;
        await fetch(fetchMatchURL)
            .then((response) => response.json())
            .then((mydata) => {
                matchData = mydata;
            });
        const gameEndTimestamp = matchData.info.gameEndTimestamp;
        const currentTime = Date.now();
        const oneMinuteInMs = 60 * 1000;
        if ((currentTime - gameEndTimestamp) <= oneMinuteInMs) {
            let userMatchData;
            for (const user of matchData.info.participants) {
                if (user.puuid && user.puuid == process.env.KIRA_L_PUUID) {
                    userMatchData = user;
                }
            }
            if (!userMatchData.win) {
                targetChannel.send(`<@582571514474266635> hat gerade ein Match in League of Legends verloren!`);
            }
        }
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