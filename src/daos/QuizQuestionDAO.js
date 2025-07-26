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
}
module.exports = QuizQuestionDAO;