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

    async getAllByUserAndGuild(userId, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${super.tableName} WHERE userId = ? AND guildId = ?`;
            this.db.all(sql, [userId, guildId], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by user and guildId:`, err.message);
                    reject(err);
                } else {
                    // Hier wird nur eine einzelne Zeile gemappt, obwohl 'all' mehrere zurückgeben könnte.
                    // Wenn Sie alle Ergebnisse wünschen, müssten Sie 'rows.map(this._mapRowToModel)' verwenden.
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    /**
     * Überprüft, ob ein Nutzer heute bereits Lotto gespielt hat.
     * @param {string} userId - Die ID des Nutzers.
     * @returns {Promise<boolean>} - True, wenn der Nutzer heute gespielt hat, sonst False.
     */
    async checkUserPlayedToday(userId, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS count FROM ${super.tableName} WHERE userId = ? AND guildId = ? AND drawnTime LIKE DATE('now') || '%'`;
            this.db.get(sql, [userId, guildId], (err, row) => {
                if (err) {
                    console.error(`Error checking if user played today:`, err.message);
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    /**
     * Überprüft, ob eine bestimmte Lottozahl bereits existiert.
     * @param {number} lottozahl - Die zu überprüfende Lottozahl.
     * @param {string} guildId - Die ID der Gilde.
     * @returns {Promise<boolean>} - True, wenn die Lottozahl für die Gilde existiert, sonst False.
     */
    async checkLottozahlExists(lottozahl, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT EXISTS(SELECT 1 FROM ${super.tableName} WHERE lottozahl = ? AND guildId = ?) AS found`;
            this.db.get(sql, [lottozahl, guildId], (err, row) => {
                if (err) {
                    console.error(`Error checking if lottozahl exists for guild:`, err.message);
                    reject(err);
                } else {
                    resolve(row.found === 1);
                }
            });
        });
    }

    async deleteManyByGuildID(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE guildId = ?`;
            this.db.run(sql, [guildId], function (err) {
                if (err) {
                    console.error(`Error deleting many from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async countByUserAndGuild(userId, guildId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS count FROM ${this.tableName} WHERE userId = ? AND guildId = ?`;
            this.db.get(sql, [userId, guildId], (err, row) => {
                if (err) {
                    console.error(`Error counting entries for user and guild:`, err.message);
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }
}

module.exports = LottozahlenDAO;