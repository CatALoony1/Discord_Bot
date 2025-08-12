// daos/GluecksradDAO.js
const BaseDAO = require('./BaseDAO');
const Gluecksrad = require('../sqliteModels/Gluecksrad');

class GluecksradDAO extends BaseDAO {
    constructor(db) {
        super(db, 'gluecksraeder');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Gluecksrad(row._id, row.guildId, row.pool, row.sonderpool);
    }

    async getById(id) {
        const row = await super.getById(id);
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll();
        return rows.map(this._mapRowToModel);
    }

    async getOneByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE guildId = ?`;
            this.db.get(sql, [guildId], (err, row) => {
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
module.exports = GluecksradDAO;