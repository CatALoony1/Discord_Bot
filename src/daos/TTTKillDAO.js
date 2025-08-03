// daos/TTTKillDAO.js
const BaseDAO = require('./BaseDAO');
const TTTKill = require('../sqliteModels/TTTKill');
const TTTRound = require('../sqliteModels/TTTRound');
const TTTRoundParticipant = require('../sqliteModels/TTTRoundParticipant');

class TTTKillDAO extends BaseDAO {

    constructor(db) {
        super(db, 'ttt_kills');
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const kill = new TTTKill(
            row._id, row.roundId, row.timestamp, row.victimPlayerId,
            row.attackerPlayerId, row.causeOfDeath
        );

        if (row.roundId_round_id) {
            kill.roundIdObj = new TTTRound(
                row.roundId_round_id, row.roundId_round_mapName,
                row.roundId_round_startTime, row.roundId_round_endTime,
                row.roundId_round_winningTeam
            );
        }

        if (row.victimPlayerId_participant_id) {
            kill.victimPlayerIdObj = new TTTRoundParticipant(
                row.victimPlayerId_participant_id, row.victimPlayerId_participant_roundId,
                row.victimPlayerId_participant_playerId, row.victimPlayerId_participant_role,
                row.victimPlayerId_participant_oldRoles
            );
        }

        if (row.attackerPlayerId_participant_id) {
            kill.attackerPlayerIdObj = new TTTRoundParticipant(
                row.attackerPlayerId_participant_id, row.attackerPlayerId_participant_roundId,
                row.attackerPlayerId_participant_playerId, row.attackerPlayerId_participant_role,
                row.attackerPlayerId_participant_oldRoles
            );
        }
        return kill;
    }

    async getById(id) {
        const sql = `
            SELECT
                tk._id, tk.roundId, tk.timestamp, tk.victimPlayerId, tk.attackerPlayerId,
                tk.causeOfDeath,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                tv._id AS victimPlayerId_participant_id, tv.roundId AS victimPlayerId_participant_roundId,
                tv.playerId AS victimPlayerId_participant_playerId, tv.role AS victimPlayerId_participant_role,
                tv.oldRoles AS victimPlayerId_participant_oldRoles,
                ta._id AS attackerPlayerId_participant_id, ta.roundId AS attackerPlayerId_participant_roundId,
                ta.playerId AS attackerPlayerId_participant_playerId, ta.role AS attackerPlayerId_participant_role,
                ta.oldRoles AS attackerPlayerId_participant_oldRoles
            FROM ttt_kills tk
            LEFT JOIN ttt_rounds tr ON tk.roundId = tr._id
            LEFT JOIN ttt_round_participants tv ON tk.victimPlayerId = tv._id
            LEFT JOIN ttt_round_participants ta ON tk.attackerPlayerId = ta._id
            WHERE tk._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching TTT kill log by ID with JOIN:', err.message);
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
                tk._id, tk.roundId, tk.timestamp, tk.victimPlayerId, tk.attackerPlayerId,
                tk.causeOfDeath,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                tv._id AS victimPlayerId_participant_id, tv.roundId AS victimPlayerId_participant_roundId,
                tv.playerId AS victimPlayerId_participant_playerId, tv.role AS victimPlayerId_participant_role,
                tv.oldRoles AS victimPlayerId_participant_oldRoles,
                ta._id AS attackerPlayerId_participant_id, ta.roundId AS attackerPlayerId_participant_roundId,
                ta.playerId AS attackerPlayerId_participant_playerId, ta.role AS attackerPlayerId_participant_role,
                ta.oldRoles AS attackerPlayerId_participant_oldRoles
            FROM ttt_kills tk
            LEFT JOIN ttt_rounds tr ON tk.roundId = tr._id
            LEFT JOIN ttt_round_participants tv ON tk.victimPlayerId = tv._id
            LEFT JOIN ttt_round_participants ta ON tk.attackerPlayerId = ta._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all TTT kills with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }
}
module.exports = TTTKillDAO;