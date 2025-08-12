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
            console.log('Start Migrating Items');
            const allItems = await Items.find({});
            console.log(allItems);
            if (allItems && allItems.length > 0) {
                let itemsToSave = [];
                for (let item of allItems) {
                    console.log(item);
                    itemsToSave.push(new SQLItems(item._id.toString(), item.name, item.beschreibung, item.preis, item.boostOnly, item.available));
                }
                console.log(`Saving ${itemsToSave.length} of ${allItems.length} Items.`);
                console.log(itemsToSave);
                let amount = await itemsDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Items saved.`);
            }
            console.log('Finished Migrating Items');

            console.log('Start Migrating GameUser');
            const allGameUser = await GameUser.find({});
            if (allGameUser && allGameUser.length > 0) {
                let itemsToSave = [];
                for (let item of allGameUser) {
                    itemsToSave.push(new SQLGameUser(item._id.toString(), item.userId, item.guildId, item.quizadded, item.daily, item.weight));
                }
                console.log(`Saving ${itemsToSave.length} of ${allGameUser.length} GameUser.`);
                let amount = await gameUserDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} GameUser saved.`);
            }
            console.log('Finished Migrating GameUser');

            console.log('Start Migrating ActiveItems');
            const allActiveItems = await ActiveItems.find({});
            if (allActiveItems && allActiveItems.length > 0) {
                let itemsToSave = [];
                for (let item of allActiveItems) {
                    itemsToSave.push(new SQLActiveItems(item._id.toString(), item.guildId, item.endTime, item.itemType, item.user, item.usedOn, item.extras));
                }
                console.log(`Saving ${itemsToSave.length} of ${allActiveItems.length} ActiveItems.`);
                let amount = await activeItemsDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} ActiveItems saved.`);
            }
            console.log('Finished Migrating ActiveItems');

            console.log('Start Migrating Bump');
            const allBump = await Bump.find({});
            if (allBump && allBump.length > 0) {
                let itemsToSave = [];
                for (let item of allBump) {
                    itemsToSave.push(new SQLBump(item._id.toString(), item.guildId, item.endTime, item.reminded, item.remindedId));
                }
                console.log(`Saving ${itemsToSave.length} of ${allBump.length} Bump.`);
                let amount = await bumpDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Bump saved.`);
            }
            console.log('Finished Migrating Bump');

            console.log('Start Migrating Config');
            const allConfigs = await Config.find({});
            if (allConfigs && allConfigs.length > 0) {
                let itemsToSave = [];
                for (let item of allConfigs) {
                    itemsToSave.push(new SQLConfig(item._id.toString(), item.guildId, item.key, item.value));
                }
                console.log(`Saving ${itemsToSave.length} of ${allConfigs.length} Config.`);
                let amount = await configDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Config saved.`);
            }
            console.log('Finished Migrating Config');

            console.log('Start Migrating Bankkonten');
            const allBankkonten = await Bankkonten.find({});
            if (allBankkonten && allBankkonten.length > 0) {
                let itemsToSave = [];
                for (let item of allBankkonten) {
                    itemsToSave.push(new SQLBankkonten(item._id.toString(), item.currentMoney, item.moneyGain, item.moneyLost, item.zinsProzent, item.besitzer));
                }
                console.log(`Saving ${itemsToSave.length} of ${allBankkonten.length} Bankkonten.`);
                let amount = await bankkontenDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Bankkonten saved.`);
            }
            console.log('Finished Migrating Bankkonten');

            console.log('Start Migrating Gluecksrad');
            const allGluecksrad = await Gluecksrad.find({});
            if (allGluecksrad && allGluecksrad.length > 0) {
                let itemsToSave = [];
                for (let item of allGluecksrad) {
                    itemsToSave.push(new SQLGluecksrad(item._id.toString(), item.guildId, item.pool, item.sonderpool));
                }
                console.log(`Saving ${itemsToSave.length} of ${allGluecksrad.length} Gluecksrad.`);
                let amount = await gluecksradDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Gluecksrad saved.`);
            }
            console.log('Finished Migrating Gluecksrad');

            console.log('Start Migrating Hangman');
            const allHangman = await Hangman.find({});
            if (allHangman && allHangman.length > 0) {
                let itemsToSave = [];
                for (let item of allHangman) {
                    itemsToSave.push(new SQLHangman(item._id.toString(), item.authorId, item.guildId, item.messageId, item.word, item.status, item.buchstaben, item.fehler, item.participants));
                }
                console.log(`Saving ${itemsToSave.length} of ${allHangman.length} Hangman.`);
                let amount = await hangmanDAO.insertMany(itemsToSave);
                console.log(`${amount} of ${itemsToSave.length} Hangman saved.`);
            }
            console.log('Finished Migrating Hangman');

            console.log('Start Migrating Inventar');
            const allInventar = await Inventar.find({}).populate({ path: 'items.item', model: 'Items' });
            if (allInventar && allInventar.length > 0) {
                let itemsToSave = [];
                for (let item of allInventar) {
                    const allItems = [];
                    for (let itemObj of Inventar.items) {
                        allItems.push({ quantity: itemObj.amount, itemId: itemObj.item._id.toString() });
                    }
                    itemsToSave.push(new SQLInventar(item._id.toString(), allItems, item.besitzer));
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
                    itemsToSave.push(new SQLTiere(item._id.toString(), item.pfad, item.tierart, item.customName, item.besitzer));
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