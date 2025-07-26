// daos/HangmanDAO.js
const BaseDAO = require('./BaseDAO');
const Hangman = require('../sqliteModels/Hangman');

class HangmanDAO extends BaseDAO {
    constructor(db) {
        super(db, 'hangmans');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Hangman(row._id, row.authorId, row.guildId, row.messageId, row.word, row.status, JSON.parse(row.buchstaben || '[]'), row.fehler, JSON.parse(row.participants || '[]'));
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
module.exports = HangmanDAO;