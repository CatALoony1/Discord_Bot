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
}
module.exports = LottozahlenDAO;