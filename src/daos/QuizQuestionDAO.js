// daos/QuizQuestionDAO.js
const BaseDAO = require('./BaseDAO');
const QuizQuestion = require('../sqliteModels/QuizQuestion');

class QuizQuestionDAO extends BaseDAO {
    constructor(db) {
        super(db, 'quiz_questions');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new QuizQuestion(
            row._id, row.question, row.rightAnswer, JSON.parse(row.wrongAnswers || '[]'),
            row.started, JSON.parse(row.participants || '[]'), row.asked,
            row.rightChar, row.answerA, row.answerB, row.answerC, row.answerD, row.guildId
        );
    }

    async getById(id) {
        const row = await super.getById(id);
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll();
        return rows.map(this._mapRowToModel);
    }

    async insert(quizQuestion) {
        const dataToSave = {
            _id: quizQuestion._id,
            question: quizQuestion.question,
            rightAnswer: quizQuestion.rightAnswer,
            wrongAnswers: JSON.stringify(quizQuestion.wrongAnswers),
            started: quizQuestion.started,
            participants: JSON.stringify(quizQuestion.participants),
            asked: quizQuestion.asked,
            rightChar: quizQuestion.rightChar,
            answerA: quizQuestion.answerA,
            answerB: quizQuestion.answerB,
            answerC: quizQuestion.answerC,
            answerD: quizQuestion.answerD,
            guildId: quizQuestion.guildId
        };
        return await super.insert(dataToSave);
    }

    /**
     * Fügt mehrere QuizQuestion-Objekte ein.
     * Serialisiert die Arrays und ruft dann super.insertMany auf.
     * @param {Array<QuizQuestion>} quizQuestions - Eine Liste von QuizQuestion-Objekten.
     * @returns {Promise<number>} - Die Anzahl der eingefügten Zeilen.
     */
    async insertMany(quizQuestions) {
        const dataToSave = quizQuestions.map(qq => ({
            _id: qq._id,
            question: qq.question,
            rightAnswer: qq.rightAnswer,
            wrongAnswers: JSON.stringify(qq.wrongAnswers),
            started: qq.started,
            participants: JSON.stringify(qq.participants),
            asked: qq.asked,
            rightChar: qq.rightChar,
            answerA: qq.answerA,
            answerB: qq.answerB,
            answerC: qq.answerC,
            answerD: qq.answerD,
            guildId: qq.guildId
        }));
        return await super.insertMany(dataToSave);
    }

    async update(quizQuestion) {
        const dataToSave = {
            _id: quizQuestion._id,
            question: quizQuestion.question,
            rightAnswer: quizQuestion.rightAnswer,
            wrongAnswers: JSON.stringify(quizQuestion.wrongAnswers),
            started: quizQuestion.started,
            participants: JSON.stringify(quizQuestion.participants),
            asked: quizQuestion.asked,
            rightChar: quizQuestion.rightChar,
            answerA: quizQuestion.answerA,
            answerB: quizQuestion.answerB,
            answerC: quizQuestion.answerC,
            answerD: quizQuestion.answerD,
            guildId: quizQuestion.guildId
        };
        return await super.update(dataToSave);
    }

    /**
     * Aktualisiert mehrere QuizQuestion-Objekte.
     * Serialisiert die Arrays und ruft dann super.updateMany auf.
     * @param {Array<QuizQuestion>} quizQuestions - Eine Liste von QuizQuestion-Objekten.
     * @returns {Promise<number>} - Die Anzahl der aktualisierten Zeilen.
     */
    async updateMany(quizQuestions) {
        const dataToSave = quizQuestions.map(qq => ({
            _id: qq._id,
            question: qq.question,
            rightAnswer: qq.rightAnswer,
            wrongAnswers: JSON.stringify(qq.wrongAnswers),
            started: qq.started,
            participants: JSON.stringify(qq.participants),
            asked: qq.asked,
            rightChar: qq.rightChar,
            answerA: qq.answerA,
            answerB: qq.answerB,
            answerC: qq.answerC,
            answerD: qq.answerD,
            guildId: qq.guildId
        }));
        return await super.updateMany(dataToSave);
    }

    async getAllUnasked(guildId) {
        return new Promise((resolve, reject) => {
            const today = new Date();
            const sql = `SELECT * FROM ${super.tableName} WHERE guildId = ? AND asked = 'N'`;
            this.db.all(sql, [guildId], (err, rows) => {
                if (err) {
                    console.error(`Error fetching unasked Questions from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapRowToModel));
                }
            });
        });
    }

    async getAllAsked(guildId) {
        return new Promise((resolve, reject) => {
            const today = new Date();
            const sql = `SELECT * FROM ${super.tableName} WHERE guildId = ? AND asked = 'J'`;
            this.db.all(sql, [guildId], (err, rows) => {
                if (err) {
                    console.error(`Error fetching unasked Questions from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapRowToModel));
                }
            });
        });
    }

    async getCountUnasked(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) as count FROM ${super.tableName} WHERE guildId = ? AND asked = 'N'`;
            this.db.get(sql, [guildId], (err, row) => {
                if (err) {
                    console.error(`Error counting unasked Questions from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }
}
module.exports = QuizQuestionDAO;
