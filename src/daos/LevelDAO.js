// daos/LevelDAO.js
const BaseDAO = require('./BaseDAO');
const Level = require('../sqliteModels/Level');

class LevelDAO extends BaseDAO {

    constructor(db) {
        super(db, 'levels');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Level(
            row._id, row.userId, row.guildId, row.xp, row.level, row.color,
            row.allxp, row.messages, row.lastMessage, row.userName, row.voicexp,
            row.messagexp, row.voicetime, row.thismonth, row.lastmonth,
            row.lastBump, row.geburtstag, row.bumps
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
module.exports = LevelDAO;