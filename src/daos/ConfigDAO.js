// daos/ConfigDAO.js
const BaseDAO = require('./BaseDAO');
const Config = require('../sqliteModels/Config');

class ConfigDAO extends BaseDAO {
    constructor(db) {
        super(db, 'configs');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Config(row._id, row.guildId, row.key, row.value);
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
module.exports = ConfigDAO;