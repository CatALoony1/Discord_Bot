const sqlite3 = require('sqlite3').verbose();
const ActiveItemsDAO = require('../daos/ActiveItemsDAO');
const BankkontenDAO = require('../daos/BankkontenDAO');
const BumpDAO = require('../daos/BumpDAO');
const ConfigDAO = require('../daos/ConfigDAO');
const GameUserDAO = require('../daos/GameUserDAO');
const GluecksradDAO = require('../daos/GluecksradDAO');
const HangmanDAO = require('../daos/HangmanDAO');
const InventarDAO = require('../daos/InventarDAO');
const ItemsDAO = require('../daos/ItemsDAO');
const LevelDAO = require('../daos/LevelDAO');
const LottozahlenDAO = require('../daos/LottozahlenDAO');
const QuizQuestionDAO = require('../daos/QuizQuestionDAO');
const QuizStatsDAO = require('../daos/QuizStatsDAO');
const TiereDAO = require('../daos/TiereDAO');
const TTTPlayerDAO = require('../daos/TTTPlayerDAO');
const TTTRoundDAO = require('../daos/TTTRoundDAO');
const TTTRoundParticipantDAO = require('../daos/TTTRoundParticipantDAO');
const TTTDamageDAO = require('../daos/TTTDamageDAO');
const TTTKillDAO = require('../daos/TTTKillDAO');
const TTTShopPurchaseDAO = require('../daos/TTTShopPurchaseDAO');

const { setDaos } = require('./daos');

async function initializeDatabase(dbPath) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return reject(err);
            }
            console.log('Connected to the SQLite database.');

            db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
                if (pragmaErr) {
                    console.error('Error enabling foreign keys:', pragmaErr.message);
                    return reject(pragmaErr);
                }
                console.log('Foreign key constraints enabled.');

                const createTableStatements = [
                    // Tabellen ohne Fremdschlüssel oder mit Fremdschlüsseln zu sich selbst (nicht in diesem Schema)
                    `
                    CREATE TABLE IF NOT EXISTS active_items (
                        _id TEXT PRIMARY KEY,
                        guildId TEXT NOT NULL,
                        endTime TEXT,
                        itemType TEXT NOT NULL,
                        user TEXT,
                        usedOn TEXT,
                        extras TEXT
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS bumps (
                        _id TEXT PRIMARY KEY,
                        guildId TEXT NOT NULL,
                        endTime TEXT,
                        reminded TEXT DEFAULT 'N',
                        remindedId TEXT
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS configs (
                        _id TEXT PRIMARY KEY,
                        guildId TEXT NOT NULL,
                        key TEXT NOT NULL,
                        value TEXT,
                        UNIQUE(guildId, key)
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS gluecksraeder (
                        _id TEXT PRIMARY KEY,
                        guildId TEXT NOT NULL UNIQUE,
                        pool INTEGER NOT NULL,
                        sonderpool INTEGER DEFAULT 0
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS hangmans (
                        _id TEXT PRIMARY KEY,
                        authorId TEXT NOT NULL,
                        guildId TEXT NOT NULL,
                        messageId TEXT NOT NULL UNIQUE,
                        word TEXT NOT NULL,
                        status TEXT DEFAULT 'laufend',
                        buchstaben TEXT DEFAULT '',
                        fehler INTEGER DEFAULT 0,
                        participants TEXT DEFAULT '[]'
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS items (
                        _id TEXT PRIMARY KEY,
                        name TEXT NOT NULL UNIQUE,
                        beschreibung TEXT,
                        preis INTEGER NOT NULL,
                        boostOnly INTEGER DEFAULT 0,
                        available INTEGER DEFAULT 1
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS levels (
                        _id TEXT PRIMARY KEY,
                        userId TEXT NOT NULL UNIQUE,
                        guildId TEXT NOT NULL,
                        xp INTEGER DEFAULT 0,
                        level INTEGER DEFAULT 0,
                        color TEXT DEFAULT '#e824b3',
                        allxp INTEGER DEFAULT 0,
                        messages INTEGER DEFAULT 0,
                        lastMessage TEXT,
                        userName TEXT,
                        voicexp INTEGER DEFAULT 0,
                        messagexp INTEGER DEFAULT 0,
                        voicetime INTEGER DEFAULT 0,
                        thismonth INTEGER DEFAULT 0,
                        lastmonth INTEGER DEFAULT 0,
                        lastBump TEXT,
                        geburtstag TEXT,
                        bumps INTEGER DEFAULT 0
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS lottozahlen (
                        _id TEXT PRIMARY KEY,
                        guildId TEXT NOT NULL,
                        drawnTime TEXT,
                        lottozahl INTEGER NOT NULL,
                        userId TEXT NOT NULL
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS quiz_questions (
                        _id TEXT PRIMARY KEY,
                        question TEXT NOT NULL,
                        right TEXT NOT NULL,
                        wrong TEXT NOT NULL,
                        started TEXT,
                        participants TEXT DEFAULT '',
                        asked TEXT DEFAULT 'N',
                        rightChar TEXT,
                        answerA INTEGER DEFAULT 0,
                        answerB INTEGER DEFAULT 0,
                        answerC INTEGER DEFAULT 0,
                        answerD INTEGER DEFAULT 0,
                        guildId TEXT NOT NULL
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS quiz_stats (
                        _id TEXT PRIMARY KEY,
                        guildId TEXT NOT NULL,
                        userId TEXT NOT NULL UNIQUE,
                        right INTEGER DEFAULT 0,
                        wrong INTEGER DEFAULT 0,
                        lastParticipation TEXT,
                        series INTEGER DEFAULT 0
                    );
                    `,
                    // game_users muss vor bankkonten, inventare und tiere erstellt werden
                    `
                    CREATE TABLE IF NOT EXISTS game_users (
                        _id TEXT PRIMARY KEY,
                        userId TEXT NOT NULL UNIQUE,
                        guildId TEXT DEFAULT NULL,
                        quizadded INTEGER DEFAULT 0,
                        daily TEXT,
                        weight INTEGER DEFAULT 0
                    );
                    `,
                    // ttt_players und ttt_rounds müssen vor ttt_round_participants erstellt werden
                    `
                    CREATE TABLE IF NOT EXISTS ttt_players (
                        _id TEXT PRIMARY KEY,
                        steamId TEXT NOT NULL UNIQUE,
                        currentNickname TEXT
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS ttt_rounds (
                        _id TEXT PRIMARY KEY,
                        mapName TEXT,
                        startTime TEXT,
                        endTime TEXT,
                        winningTeam TEXT
                    );
                    `,
                    // Tabellen mit Fremdschlüsseln, die jetzt aufgelöst werden können
                    `
                    CREATE TABLE IF NOT EXISTS bankkonten (
                        _id TEXT PRIMARY KEY,
                        currentMoney INTEGER DEFAULT 0,
                        moneyGain INTEGER DEFAULT 0,
                        moneyLost INTEGER DEFAULT 0,
                        zinsProzent INTEGER DEFAULT 0,
                        besitzer TEXT NOT NULL UNIQUE,
                        FOREIGN KEY (besitzer) REFERENCES game_users(_id) ON DELETE CASCADE
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS inventare (
                        _id TEXT PRIMARY KEY,
                        besitzer TEXT NOT NULL UNIQUE,
                        items TEXT,
                        FOREIGN KEY (besitzer) REFERENCES game_users(_id) ON DELETE CASCADE
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS tiere (
                        _id TEXT PRIMARY KEY,
                        pfad TEXT NOT NULL,
                        tierart TEXT NOT NULL,
                        customName TEXT,
                        besitzer TEXT,
                        FOREIGN KEY (besitzer) REFERENCES game_users(_id) ON DELETE SET NULL
                    );
                    `,
                    // ttt_round_participants muss vor ttt_damage_logs, ttt_kills und ttt_shop_purchases erstellt werden
                    `
                    CREATE TABLE IF NOT EXISTS ttt_round_participants (
                        _id TEXT PRIMARY KEY,
                        roundId TEXT NOT NULL,
                        playerId TEXT NOT NULL,
                        role TEXT,
                        oldRoles TEXT,
                        FOREIGN KEY (roundId) REFERENCES ttt_rounds(_id) ON DELETE CASCADE,
                        FOREIGN KEY (playerId) REFERENCES ttt_players(_id) ON DELETE CASCADE
                    );
                    `,
                    // Tabellen mit Fremdschlüsseln, die jetzt aufgelöst werden können
                    `
                    CREATE TABLE IF NOT EXISTS ttt_damage_logs (
                        _id TEXT PRIMARY KEY,
                        roundId TEXT NOT NULL,
                        timestamp TEXT,
                        victimPlayerId TEXT NOT NULL,
                        attackerPlayerId TEXT NOT NULL,
                        damageSource TEXT,
                        damageAmount INTEGER,
                        FOREIGN KEY (roundId) REFERENCES ttt_rounds(_id) ON DELETE CASCADE,
                        FOREIGN KEY (victimPlayerId) REFERENCES ttt_round_participants(_id) ON DELETE CASCADE,
                        FOREIGN KEY (attackerPlayerId) REFERENCES ttt_round_participants(_id) ON DELETE CASCADE
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS ttt_kills (
                        _id TEXT PRIMARY KEY,
                        roundId TEXT NOT NULL,
                        timestamp TEXT,
                        victimPlayerId TEXT NOT NULL,
                        attackerPlayerId TEXT NOT NULL,
                        causeOfDeath TEXT,
                        FOREIGN KEY (roundId) REFERENCES ttt_rounds(_id) ON DELETE CASCADE,
                        FOREIGN KEY (victimPlayerId) REFERENCES ttt_round_participants(_id) ON DELETE CASCADE,
                        FOREIGN KEY (attackerPlayerId) REFERENCES ttt_round_participants(_id) ON DELETE CASCADE
                    );
                    `,
                    `
                    CREATE TABLE IF NOT EXISTS ttt_shop_purchases (
                        _id TEXT PRIMARY KEY,
                        roundId TEXT NOT NULL,
                        timestamp TEXT,
                        buyerId TEXT NOT NULL,
                        itemName TEXT,
                        FOREIGN KEY (roundId) REFERENCES ttt_rounds(_id) ON DELETE CASCADE,
                        FOREIGN KEY (buyerId) REFERENCES ttt_round_participants(_id) ON DELETE CASCADE
                    );
                    `
                ];

                // Führe jede CREATE TABLE Anweisung sequentiell aus
                db.serialize(() => {
                    let errors = [];
                    let completedStatements = 0;
                    const totalStatements = createTableStatements.length;

                    createTableStatements.forEach((statement, index) => {
                        db.run(statement, async function (runErr) { // Use 'function' to get 'this' context if needed for lastID/changes
                            completedStatements++;
                            if (runErr) {
                                console.error(`Error creating table with statement ${index + 1}:`, runErr.message);
                                errors.push(runErr);
                            } else {
                                console.log(`Table created successfully with statement ${index + 1}.`);
                            }

                            // Check if all statements have completed
                            if (completedStatements === totalStatements) {
                                if (errors.length > 0) {
                                    reject(new Error('Database initialization completed with errors.'));
                                } else {
                                    console.log('All tables created or already exist.');
                                    await setDatabaseToDAOs(db);
                                    resolve(db); // Löse mit dem Datenbankobjekt auf
                                }
                            }
                        });
                    });
                });
            });
        });
    });
}

async function setDatabaseToDAOs(database) {
    // Instanziieren Sie alle DAOs
    const activeItemsDAO = new ActiveItemsDAO(database);
    const bankkontenDAO = new BankkontenDAO(database);
    const bumpDAO = new BumpDAO(database);
    const configDAO = new ConfigDAO(database);
    const gameUserDAO = new GameUserDAO(database);
    const gluecksradDAO = new GluecksradDAO(database);
    const hangmanDAO = new HangmanDAO(database);
    const itemsDAO = new ItemsDAO(database);
    const inventarDAO = new InventarDAO(database, itemsDAO);
    const levelDAO = new LevelDAO(database);
    const lottozahlenDAO = new LottozahlenDAO(database);
    const quizQuestionDAO = new QuizQuestionDAO(database);
    const quizStatsDAO = new QuizStatsDAO(database);
    const tiereDAO = new TiereDAO(database);
    const tttPlayerDAO = new TTTPlayerDAO(database);
    const tttRoundDAO = new TTTRoundDAO(database);
    const tttRoundParticipantDAO = new TTTRoundParticipantDAO(database);
    const tttDamageDAO = new TTTDamageDAO(database);
    const tttKillDAO = new TTTKillDAO(database);
    const tttShopPurchaseDAO = new TTTShopPurchaseDAO(database);

    // Setzen Sie die statischen Abhängigkeiten für DAOs mit Fremdschlüsseln
    // GameUser ist eine häufige Referenz (basierend auf FKs in initializeDB.js)
    BankkontenDAO.gameUserDAO = gameUserDAO;
    InventarDAO.gameUserDAO = gameUserDAO;
    InventarDAO.itemsDAO = itemsDAO;
    TiereDAO.gameUserDAO = gameUserDAO;

    // TTT-Beziehungen (basierend auf FKs in initializeDB.js)
    TTTRoundParticipantDAO.tttRoundDAO = tttRoundDAO;
    TTTRoundParticipantDAO.tttPlayerDAO = tttPlayerDAO;

    TTTDamageDAO.tttRoundDAO = tttRoundDAO;
    TTTDamageDAO.tttRoundParticipantDAO = tttRoundParticipantDAO;

    TTTKillDAO.tttRoundDAO = tttRoundDAO;
    TTTKillDAO.tttRoundParticipantDAO = tttRoundParticipantDAO;

    TTTShopPurchaseDAO.tttRoundDAO = tttRoundDAO;
    TTTShopPurchaseDAO.tttRoundParticipantDAO = tttRoundParticipantDAO;
    setDaos({
        activeItemsDAO,
        bankkontenDAO,
        bumpDAO,
        configDAO,
        gameUserDAO,
        gluecksradDAO,
        itemsDAO,
        hangmanDAO,
        inventarDAO,
        levelDAO,
        lottozahlenDAO,
        quizQuestionDAO,
        quizStatsDAO,
        tiereDAO,
        tttDamageDAO,
        tttKillDAO,
        tttPlayerDAO,
        tttRoundDAO,
        tttRoundParticipantDAO,
        tttShopPurchaseDAO
    });
}

module.exports = {
    initializeDatabase
};