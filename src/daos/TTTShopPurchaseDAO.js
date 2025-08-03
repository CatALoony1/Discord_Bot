// daos/TTTShopPurchaseDAO.js
const BaseDAO = require('./BaseDAO');
const TTTShopPurchase = require('../sqliteModels/TTTShopPurchase');
const TTTRound = require('../sqliteModels/TTTRound');
const TTTRoundParticipant = require('../sqliteModels/TTTRoundParticipant');

class TTTShopPurchaseDAO extends BaseDAO {

    constructor(db) {
        super(db, 'ttt_shop_purchases');
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const purchase = new TTTShopPurchase(
            row._id, row.roundId, row.timestamp, row.buyerId, row.itemName
        );

        if (row.roundId_round_id) {
            purchase.roundIdObj = new TTTRound(
                row.roundId_round_id, row.roundId_round_mapName,
                row.roundId_round_startTime, row.roundId_round_endTime,
                row.roundId_round_winningTeam
            );
        }

        if (row.buyerId_participant_id) {
            purchase.buyerIdObj = new TTTRoundParticipant(
                row.buyerId_participant_id, row.buyerId_participant_roundId,
                row.buyerId_participant_playerId, row.buyerId_participant_role,
                row.buyerId_participant_oldRoles
            );
        }
        return purchase;
    }

    async getById(id) {
        const sql = `
            SELECT
                tsp._id, tsp.roundId, tsp.timestamp, tsp.buyerId, tsp.itemName,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                trp._id AS buyerId_participant_id, trp.roundId AS buyerId_participant_roundId,
                trp.playerId AS buyerId_participant_playerId, trp.role AS buyerId_participant_role,
                trp.oldRoles AS buyerId_participant_oldRoles
            FROM ttt_shop_purchases tsp
            LEFT JOIN ttt_rounds tr ON tsp.roundId = tr._id
            LEFT JOIN ttt_round_participants trp ON tsp.buyerId = trp._id
            WHERE tsp._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching TTT shop purchase by ID with JOIN:', err.message);
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
                tsp._id, tsp.roundId, tsp.timestamp, tsp.buyerId, tsp.itemName,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                trp._id AS buyerId_participant_id, trp.roundId AS buyerId_participant_roundId,
                trp.playerId AS buyerId_participant_playerId, trp.role AS buyerId_participant_role,
                trp.oldRoles AS buyerId_participant_oldRoles
            FROM ttt_shop_purchases tsp
            LEFT JOIN ttt_rounds tr ON tsp.roundId = tr._id
            LEFT JOIN ttt_round_participants trp ON tsp.buyerId = trp._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all TTT shop purchases with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }
}
module.exports = TTTShopPurchaseDAO;