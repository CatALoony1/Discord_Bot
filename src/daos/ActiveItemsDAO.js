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

    async getOneByGuildAndItemType(guildId, itemType) {
        const sql = `
            SELECT * FROM active_items
            WHERE guildId = ? AND itemType = ?
            ORDER BY endTime DESC
            LIMIT 1;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [guildId, itemType], (err, row) => {
                if (err) {
                    console.error('Error fetching active item by guild and type:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    async getOneByGuildItemTypeUser(guildId, itemType, user) {
        const sql = `
            SELECT * FROM active_items
            WHERE guildId = ? AND itemType = ? AND user = ?
            ORDER BY endTime DESC
            LIMIT 1;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [guildId, itemType, user], (err, row) => {
                if (err) {
                    console.error('Error fetching active item by guild, type and user:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    async getOneByGuildItemTypeUserUsedOn(guildId, itemType, user, usedOn) {
        const sql = `
            SELECT * FROM active_items
            WHERE guildId = ? AND itemType = ? AND user = ? AND usedOn = ?
            ORDER BY endTime DESC
            LIMIT 1;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [guildId, itemType, user, usedOn], (err, row) => {
                if (err) {
                    console.error('Error fetching active item by guild, type, user and usedOn:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }
}
module.exports = ActiveItemsDAO;