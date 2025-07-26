// daos/ActiveItemsDAO.js
const BaseDAO = require('./BaseDAO');
const ActiveItems = require('../sqliteModels/ActiveItems');

class ActiveItemsDAO extends BaseDAO {
    constructor(db) {
        super(db, 'active_items');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new ActiveItems(row._id, row.guildId, row.endTime, row.itemType, row.user, row.usedOn, row.extras);
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
module.exports = ActiveItemsDAO;