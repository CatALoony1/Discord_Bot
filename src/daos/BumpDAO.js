// daos/BumpDAO.js
const BaseDAO = require('./BaseDAO');
const Bump = require('../sqliteModels/Bump');

class BumpDAO extends BaseDAO {
    constructor(db) {
        super(db, 'bumps');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Bump(row._id, row.guildId, row.endTime, row.reminded, row.remindedId);
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
module.exports = BumpDAO;