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

    async getActiveByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE guildId = ? AND status = 'laufend'`;
            this.db.get(sql, [guildId], (err, row) => {
                if (err) {
                    console.error(`Error fetching active hangman by guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    async deleteFinishedByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE guildId = ? AND status = 'beendet'`;
            this.db.run(sql, [guildId], function (err) {
                if (err) {
                    console.error(`Error deleting finished hangman by guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }
}
module.exports = HangmanDAO;