// daos/LottozahlenDAO.js
const BaseDAO = require('./BaseDAO');
const Lottozahlen = require('../sqliteModels/Lottozahlen');

class LottozahlenDAO extends BaseDAO {

    constructor(db) {
        super(db, 'lottozahlen');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Lottozahlen(
            row._id, row.guildId, row.drawnTime, row.lottozahl, row.userId
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

    async getAllByUserAndGuild(userId, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${super.tableName} WHERE userId = ? AND guildId = ?`;
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
}
module.exports = LottozahlenDAO;