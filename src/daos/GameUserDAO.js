// daos/GameUserDAO.js
const BaseDAO = require('./BaseDAO');
const GameUser = require('../sqliteModels/GameUser');

class GameUserDAO extends BaseDAO {
    constructor(db) {
        super(db, 'game_users');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new GameUser(row._id, row.userId, row.guildId, row.quizadded, row.daily, row.weight);
    }

    async getById(id) {
        const row = await super.getById(id);
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll();
        return rows.map(this._mapRowToModel);
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
module.exports = GameUserDAO;