// daos/ItemsDAO.js
const BaseDAO = require('./BaseDAO');
const Items = require('../sqliteModels/Items');

class ItemsDAO extends BaseDAO {
    constructor(db) {
        super(db, 'items');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Items(row._id, row.name, row.beschreibung, row.preis, row.boostOnly, row.available);
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
module.exports = ItemsDAO;