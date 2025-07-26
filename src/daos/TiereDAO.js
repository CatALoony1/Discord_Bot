// daos/TiereDAO.js
const BaseDAO = require('./BaseDAO');
const Tiere = require('../sqliteModels/Tiere');
const GameUser = require('../sqliteModels/GameUser');

class TiereDAO extends BaseDAO {
    static gameUserDAO;

    constructor(db) {
        super(db, 'tiere');
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
            LEFT JOIN game_users gu ON t.besitzer = gu._id;
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
}
module.exports = TiereDAO;