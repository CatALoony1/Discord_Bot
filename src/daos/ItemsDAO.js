// daos/ItemsDAO.js
const BaseDAO = require('./BaseDAO');
const Items = require('../sqliteModels/Items');

class ItemsDAO extends BaseDAO {
    constructor(db) {
        super(db, 'items');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Items(row._id, row.name, row.beschreibung, row.preis, row.boostOnly === 1, row.available === 1);
    }

    async getById(id) {
        const row = await super.getById(id);
        return this._mapRowToModel(row);
    }

    async getAll() {
        const rows = await super.getAll();
        return rows.map(this._mapRowToModel);
    }

    async getAllAvailable() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE available = 1`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} where available = 1:`, err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapRowToModel));
                }
            });
        });
    }

    async getOneByName(name) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE name = ?`;
            this.db.get(sql, [name], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} where name = ${name}:`, err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }
}
module.exports = ItemsDAO;