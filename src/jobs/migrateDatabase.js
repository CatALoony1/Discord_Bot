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

            console.log('Start Migrating Tiere');
            const alltiere = await Tiere.find({});
            if (alltiere && alltiere.length > 0) {
                let itemsToSave = [];
                for (let item of alltiere) {
                    itemsToSave.push(new SQLTiere(item._id.toString(), item.pfad, item.tierart, item.customName, item.besitzer ? item.besitzer.toString() : item.besitzer));
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