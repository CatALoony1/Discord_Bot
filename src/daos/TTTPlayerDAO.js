// daos/TTTPlayerDAO.js
const BaseDAO = require('./BaseDAO');
const TTTPlayer = require('../sqliteModels/TTTPlayer');

class TTTPlayerDAO extends BaseDAO {
    constructor(db) {
        super(db, 'ttt_players');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new TTTPlayer(row._id, row.steamId, row.currentNickname);
    }

    async getById(id) {
        const row = await super.getById(id);
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll();
        return rows.map(this._mapRowToModel);
    }

    async getBySteamId(steamId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE steamId = ?`;
            this.db.get(sql, [steamId], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by steamId:`, err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }
}
module.exports = TTTPlayerDAO;