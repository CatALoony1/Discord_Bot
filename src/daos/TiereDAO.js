// daos/TiereDAO.js
const BaseDAO = require('./BaseDAO');
const Tiere = require('../sqliteModels/Tiere');
const GameUser = require('../sqliteModels/GameUser');

class TiereDAO extends BaseDAO {

    constructor(db) {
        super(db, 'tiere');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Tiere(row._id, row.pfad, row.tierart, row.customName, row.besitzer);
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const tier = new Tiere(
            row._id, row.pfad, row.tierart, row.customName, row.besitzer
        );

        if (row.besitzer_user_id) {
            tier.besitzerObj = new GameUser(
                row.besitzer_user_id,
                row.besitzer_user_userId,
                row.besitzer_user_guildId,
                row.besitzer_user_quizadded,
                row.besitzer_user_daily,
                row.besitzer_user_weight
            );
        }
        return tier;
    }

    async getById(id) {
        const sql = `
            SELECT
                t._id, t.pfad, t.tierart, t.customName, t.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM tiere t
            LEFT JOIN game_users gu ON t.besitzer = gu._id
            WHERE t._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching tier by ID with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapJoinedRowToModel(row));
                }
            });
        });
    }

    async getAll() {
        const sql = `
            SELECT
                t._id, t.pfad, t.tierart, t.customName, t.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM tiere t
            LEFT JOIN game_users gu ON t.besitzer = gu._id
            ORDER BY t._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all tiere with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }

    async getAllByUserAndGuild(userId, guildId) {
        const sql = `
            SELECT 
                t._id, t.pfad, t.tierart, t.customName, t.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight 
            FROM tiere t
            LEFT JOIN game_users gu ON t.besitzer = gu._id
            WHERE gu.userId = ? AND gu.guildId = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [userId, guildId], (err, rows) => {
                if (err) {
                    console.error('Error fetching tiere by user and guild with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }

    /**
     * Gibt alle Tiere zu einem Besitzer zurück, jedoch ohne das Besitzer-Objekt.
     * 
     * @param {String} besitzerId 
     * @returns 
     */
    async getAllByBesitzer(besitzerId) {
        const sql = `
            SELECT 
                t._id, t.pfad, t.tierart, t.customName, t.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight 
            FROM tiere t
            LEFT JOIN game_users gu ON t.besitzer = gu._id
            WHERE gu.userId = ? AND gu.guildId = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [besitzerId], (err, rows) => {
                if (err) {
                    console.error('Error fetching tiere by user and guild with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }

    async getOneByPfad(pfad) {
        const sql = `
            SELECT
                t._id, t.pfad, t.tierart, t.customName, t.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM tiere t
            LEFT JOIN game_users gu ON t.besitzer = gu._id
            WHERE t.pfad = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [pfad], (err, row) => {
                if (err) {
                    console.error('Error fetching tier by pfad with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapJoinedRowToModel(row));
                }
            });
        });
    }

    async getTierartenOhneBesitzer() {
        const sql = `
            SELECT DISTINCT tierart FROM tiere WHERE besitzer IS NULL;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching tierarten without owner:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(row => row.tierart));
                }
            });
        });
    }

    async getRandomTierOhneBesitzerByTierart(tierart) {
        const sql = `
            SELECT * FROM tiere 
            WHERE tierart = ? AND besitzer IS NULL 
            ORDER BY RANDOM() LIMIT 1;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [tierart], (err, row) => {
                if (err) {
                    console.error('Error fetching random tier without owner by tierart:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapRowToModel(row));
                }
            });
        });
    }

    async getAllPfade() {
        const sql = `
            SELECT pfad FROM tiere;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all paths of tiere:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(row => row.pfad));
                }
            });
        });
    }
}
module.exports = TiereDAO;