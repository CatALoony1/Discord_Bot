// daos/BankkontenDAO.js
const BaseDAO = require('./BaseDAO');
const Bankkonten = require('../sqliteModels/Bankkonten');
const GameUser = require('../sqliteModels/GameUser');

class BankkontenDAO extends BaseDAO {

    constructor(db) {
        super(db, 'bankkonten');
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const bankkonto = new Bankkonten(
            row._id,
            row.currentMoney,
            row.moneyGain,
            row.moneyLost,
            row.zinsProzent,
            row.besitzer // Die ID
        );

        if (row.besitzer_user_id) { // Prüfen, ob GameUser-Daten vorhanden sind (durch JOIN)
            bankkonto.besitzerObj = new GameUser(
                row.besitzer_user_id,
                row.besitzer_user_userId,
                row.besitzer_user_guildId,
                row.besitzer_user_quizadded,
                row.besitzer_user_daily,
                row.besitzer_user_weight
            );
        }
        return bankkonto;
    }

    async getById(id) {
        const sql = `
            SELECT
                b._id, b.currentMoney, b.moneyGain, b.moneyLost, b.zinsProzent, b.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM bankkonten b
            LEFT JOIN game_users gu ON b.besitzer = gu._id
            WHERE b._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching bankkonto by ID with JOIN:', err.message);
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
                b._id, b.currentMoney, b.moneyGain, b.moneyLost, b.zinsProzent, b.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM bankkonten b
            LEFT JOIN game_users gu ON b.besitzer = gu._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all bankkonten with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }

    async insert(bankkonto) {
        const dataToSave = {
            _id: bankkonto._id,
            currentMoney: bankkonto.currentMoney,
            moneyGain: bankkonto.moneyGain,
            moneyLost: bankkonto.moneyLost,
            zinsProzent: bankkonto.zinsProzent,
            besitzer: bankkonto.besitzer
        };
        return await super.insert(dataToSave);
    }

    async update(bankkonto) {
        const dataToSave = {
            _id: bankkonto._id,
            currentMoney: bankkonto.currentMoney,
            moneyGain: bankkonto.moneyGain,
            moneyLost: bankkonto.moneyLost,
            zinsProzent: bankkonto.zinsProzent,
            besitzer: bankkonto.besitzer
        };
        return await super.update(dataToSave);
    }

    async getAllByGuild(guildId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    b._id, b.currentMoney, b.moneyGain, b.moneyLost, b.zinsProzent, b.besitzer,
                    gu._id AS besitzer_user_id,
                    gu.userId AS besitzer_user_userId,
                    gu.guildId AS besitzer_user_guildId,
                    gu.quizadded AS besitzer_user_quizadded,
                    gu.daily AS besitzer_user_daily,
                    gu.weight AS besitzer_user_weight
                FROM bankkonten b
                LEFT JOIN game_users gu ON b.besitzer = gu._id
                WHERE gu.guildId = ?;
            `;
            this.db.all(sql, [guildId], (err, rows) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by guildId:`, err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }

    async getOneByUserAndGuild(userId, guildId) {
        const sql = `
            SELECT
                b._id, b.currentMoney, b.moneyGain, b.moneyLost, b.zinsProzent, b.besitzer,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM bankkonten b
            LEFT JOIN game_users gu ON b.besitzer = gu._id
            WHERE gu.userId = ? AND gu.guildId = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [userId, guildId], (err, row) => {
                if (err) {
                    console.error('Error fetching bankkonto by ID with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(this._mapJoinedRowToModel(row));
                }
            });
        });
    }
}
module.exports = BankkontenDAO;