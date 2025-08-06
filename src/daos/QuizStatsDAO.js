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

    async getAllByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${super.tableName} WHERE guildId = ?`;
            this.db.all(sql, [userId, guildId], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    async deleteOnyByUserAndGuild(userId, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${super.tableName} WHERE userId = ? AND guildId = ?`;
            this.db.run(sql, [userId, guildId], function (err) {
                if (err) {
                    console.error(`Error deleting from ${this.tableName} by userId and guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(this.changes); // Returns number of rows deleted
                }
            });
        });
    }

    async getOneByUserAndGuild(userId, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${super.tableName} WHERE userId = ? AND guildId = ?`;
            this.db.get(sql, [userId, guildId], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by userId and guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }
}
module.exports = QuizStatsDAO;