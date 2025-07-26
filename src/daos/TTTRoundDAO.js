// daos/TTTRoundDAO.js
const BaseDAO = require('./BaseDAO');
const TTTRound = require('../sqliteModels/TTTRound');

class TTTRoundDAO extends BaseDAO {
    constructor(db) {
        super(db, 'ttt_rounds');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new TTTRound(row._id, row.mapName, row.startTime, row.endTime, row.winningTeam);
    }

    async getById(id) {
        const row = await super.getById(id);
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll();
        return rows.map(this._mapRowToModel);
    }
}
module.exports = TTTRoundDAO;