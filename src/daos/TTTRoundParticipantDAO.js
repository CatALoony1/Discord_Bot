// daos/TTTRoundParticipantDAO.js
const BaseDAO = require('./BaseDAO');
const TTTRoundParticipant = require('../sqliteModels/TTTRoundParticipant');
const TTTRound = require('../sqliteModels/TTTRound');
const TTTPlayer = require('../sqliteModels/TTTPlayer');

class TTTRoundParticipantDAO extends BaseDAO {
    static tttRoundDAO;
    static tttPlayerDAO;

    constructor(db) {
        super(db, 'ttt_round_participants');
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const participant = new TTTRoundParticipant(
            row._id, row.roundId, row.playerId, row.role, row.oldRoles
        );

        if (row.roundId_round_id) {
            participant.roundIdObj = new TTTRound(
                row.roundId_round_id, row.roundId_round_mapName,
                row.roundId_round_startTime, row.roundId_round_endTime,
                row.roundId_round_winningTeam
            );
        }

        if (row.playerId_player_id) {
            participant.playerIdObj = new TTTPlayer(
                row.playerId_player_id, row.playerId_player_steamId,
                row.playerId_player_currentNickname
            );
        }
        return participant;
    }

    async getById(id) {
        const sql = `
            SELECT
                trp._id, trp.roundId, trp.playerId, trp.role, trp.oldRoles,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                tp._id AS playerId_player_id, tp.steamId AS playerId_player_steamId,
                tp.currentNickname AS playerId_player_currentNickname
            FROM ttt_round_participants trp
            LEFT JOIN ttt_rounds tr ON trp.roundId = tr._id
            LEFT JOIN ttt_players tp ON trp.playerId = tp._id
            WHERE trp._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching TTT round participant by ID with JOIN:', err.message);
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
                trp._id, trp.roundId, trp.playerId, trp.role, trp.oldRoles,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                tp._id AS playerId_player_id, tp.steamId AS playerId_player_steamId,
                tp.currentNickname AS playerId_player_currentNickname
            FROM ttt_round_participants trp
            LEFT JOIN ttt_rounds tr ON trp.roundId = tr._id
            LEFT JOIN ttt_players tp ON trp.playerId = tp._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all TTT round participants with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }
}
module.exports = TTTRoundParticipantDAO;