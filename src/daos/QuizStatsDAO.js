// daos/QuizStatsDAO.js
const BaseDAO = require('./BaseDAO');
const QuizStats = require('../sqliteModels/QuizStats');

class QuizStatsDAO extends BaseDAO {

    constructor(db) {
        super(db, 'quiz_stats');
    }

    _mapRowToModel(row) {
        if (!row) return null;

        const quizStats = new QuizStats(
            row._id, row.guildId, row.userId, row.rightCount, row.wrongCount,
            row.lastParticipation, row.series
        );
        // KEIN quizStats.userIdObj = ...; hier
        return quizStats;
    }

    async getById(id) {
        const row = await super.getById(id); // Nutzt BaseDAO ohne JOIN
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll(); // Nutzt BaseDAO ohne JOIN
        return rows.map(this._mapRowToModel);
    }
}
module.exports = QuizStatsDAO;