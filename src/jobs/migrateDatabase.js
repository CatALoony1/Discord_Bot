const ActiveItems = require('../models/ActiveItems.js');
const Bankkonten = require('../models/Bankkonten.js');
const Bump = require('../models/Bump.js');
const Config = require('../models/Config.js');
const GameUser = require('../models/GameUser.js');
const Gluecksrad = require('../models/Gluecksrad.js');
const Hangman = require('../models/Hangman.js');
const Inventar = require('../models/Inventar.js');
const Items = require('../models/Items.js');
const Level = require('../models/Level.js');
const Lottozahlen = require('../models/Lottozahlen.js');
const QuizQuestion = require('../models/QuizQuestion.js');
const QuizStats = require('../models/QuizStats.js');
const Tiere = require('../models/Tiere.js');

const SQLActiveItems = require('../sqliteModels/ActiveItems.js');
const SQLBankkonten = require('../sqliteModels/Bankkonten.js');
const SQLBump = require('../sqliteModels/Bump.js');
const SQLConfig = require('../sqliteModels/Config.js');
const SQLGameUser = require('../sqliteModels/GameUser.js');
const SQLGluecksrad = require('../sqliteModels/Gluecksrad.js');
const SQLHangman = require('../sqliteModels/Hangman.js');
const SQLInventar = require('../sqliteModels/Inventar.js');
const SQLItems = require('../sqliteModels/Items.js');
const SQLLevel = require('../sqliteModels/Level.js');
const SQLLottozahlen = require('../sqliteModels/Lottozahlen.js');
const SQLQuizQuestion = require('../sqliteModels/QuizQuestion.js');
const SQLQuizStats = require('../sqliteModels/QuizStats.js');
const SQLTiere = require('../sqliteModels/Tiere.js');

const { getDaos } = require('../utils/daos.js');

async function jobFunction(client) {
    try {
        const { activeItemsDAO, bankkontenDAO, bumpDAO, configDAO, gameUserDAO, gluecksradDAO, hangmanDAO, inventarDAO, itemsDAO, levelDAO, lottozahlenDAO, quizQuestionDAO, quizStatsDAO, tiereDAO } = getDaos();
        const backupDone = await Config.findOne({ key: 'BackupDone' });
        if (backupDone.value == 'N') {
            console.log('Start Migrating Inventar');
            const allInventar = await Inventar.find({}).populate({ path: 'items.item', model: 'Items' });
            if (allInventar && allInventar.length > 0) {
                let itemsToSave = [];
                for (let item of allInventar) {
                    const allItems = [];
                    for (let itemObj of item.items) {
                        allItems.push({ quantity: itemObj.amount, itemId: itemObj.item._id.toString() });
                    }
                    itemsToSave.push(new SQLInventar(item._id.toString(), allItems, item.besitzer.toString()));
                }
                console.log(`Saving ${itemsToSave.length} of ${allInventar.length} Inventar.`);
                let amount = await inventarDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Inventar saved.`);
            }
            console.log('Finished Migrating Inventar');

            console.log('Start Migrating Level');
            const allLevel = await Level.find({});
            if (allLevel && allLevel.length > 0) {
                let itemsToSave = [];
                for (let item of allLevel) {
                    itemsToSave.push(new SQLLevel(item._id.toString(), item.userId, item.guildId, item.xp, item.level, item.color, item.allxp, item.messages, item.lastMessage, item.userName, item.voicexp, item.messagexp, item.voicetime, item.thismonth, item.lastmonth, item.lastBump, item.geburtstag, item.bumps));
                }
                console.log(`Saving ${itemsToSave.length} of ${allLevel.length} Level.`);
                let amount = await levelDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Level saved.`);
            }
            console.log('Finished Migrating Level');

            console.log('Start Migrating QuizQuestions');
            const allQuizQuestions = await QuizQuestion.find({});
            if (allQuizQuestions && allQuizQuestions.length > 0) {
                let itemsToSave = [];
                for (let item of allQuizQuestions) {
                    itemsToSave.push(new SQLQuizQuestion(item._id.toString(), item.question, item.right, item.wrong, item.started, item.participants, item.asked, item.rightChar, item.answerA, item.answerB, item.answerC, item.answerD, item.guildId));
                }
                console.log(`Saving ${itemsToSave.length} of ${allQuizQuestions.length} QuizQuestions.`);
                let amount = await quizQuestionDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} QuizQuestions saved.`);
            }
            console.log('Finished Migrating QuizQuestions');

            console.log('Start Migrating Quizstats');
            const allQuizStats = await QuizStats.find({});
            if (allQuizStats && allQuizStats.length > 0) {
                let itemsToSave = [];
                for (let item of allQuizStats) {
                    itemsToSave.push(new SQLQuizStats(item._id.toString(), item.guildId, item.userId, item.right, item.wrong, item.lastParticipation, item.series));
                }
                console.log(`Saving ${itemsToSave.length} of ${allQuizStats.length} Quizstats.`);
                let amount = await quizStatsDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Quizstats saved.`);
            }
            console.log('Finished Migrating Quizstats');

            console.log('Start Migrating Lottozahlen');
            const allLottozahlen = await Lottozahlen.find({});
            if (allLottozahlen && allLottozahlen.length > 0) {
                let itemsToSave = [];
                for (let item of allLottozahlen) {
                    itemsToSave.push(new SQLLottozahlen(item._id.toString(), item.guildId, item.drawnTime, item.lottozahl, item.userId));
                }
                console.log(`Saving ${itemsToSave.length} of ${allLottozahlen.length} Lottozahlen.`);
                let amount = await lottozahlenDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Lottozahlen saved.`);
            }
            console.log('Finished Migrating Lottozahlen');

            console.log('Start Migrating Tiere');
            const alltiere = await Tiere.find({});
            if (alltiere && alltiere.length > 0) {
                let itemsToSave = [];
                for (let item of alltiere) {
                    itemsToSave.push(new SQLTiere(item._id.toString(), item.pfad, item.tierart, item.customName, item.besitzer.toString()));
                }
                console.log(`Saving ${itemsToSave.length} of ${alltiere.length} Tiere.`);
                let amount = await tiereDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Tiere saved.`);
            }
            console.log('Finished Migrating Tiere');

            console.log('Finished Migration');
            backupDone.value('J');
            await backupDone.save();
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    jobFunction
};