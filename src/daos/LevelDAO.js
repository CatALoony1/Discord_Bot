// daos/LevelDAO.js
const BaseDAO = require('./BaseDAO');
const Level = require('../sqliteModels/Level');

class LevelDAO extends BaseDAO {

    constructor(db) {
        super(db, 'levels');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Level(
            row._id, row.userId, row.guildId, row.xp, row.level, row.color,
            row.allxp, row.messages, row.lastMessage, row.userName, row.voicexp,
            row.messagexp, row.voicetime, row.thismonth, row.lastmonth,
            row.lastBump, row.geburtstag, row.bumps
        );
    }

    async getById(id) {
        const row = await super.getById(id); // Nutzt BaseDAO ohne JOIN
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll(); // Nutzt BaseDAO ohne JOIN
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

    async getAllByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${super.tableName} WHERE guildId = ?`;
            this.db.all(sql, [guildId], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    async getAllBirthdayTodayByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${super.tableName} WHERE guildId = ? AND geburtstag IS NOT NULL AND strftime('%m-%d', geburtstag) = strftime('%m-%d', 'now')`;
            this.db.all(sql, [guildId], (err, rows) => {
                if (err) {
                    console.error(`Error fetching birthday levels from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapRowToModel));
                }
            });
        });
    }
}
module.exports = LevelDAO;