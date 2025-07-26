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
}
module.exports = GluecksradDAO;