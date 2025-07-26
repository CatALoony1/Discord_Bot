// daos/TTTDamageDAO.js
const BaseDAO = require('./BaseDAO');
const TTTDamage = require('../sqliteModels/TTTDamage');
const TTTRound = require('../sqliteModels/TTTRound');
const TTTRoundParticipant = require('../sqliteModels/TTTRoundParticipant');

class TTTDamageDAO extends BaseDAO {
    static tttRoundDAO;
    static tttRoundParticipantDAO;

    constructor(db) {
        super(db, 'ttt_damage_logs');
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const damage = new TTTDamage(
            row._id, row.roundId, row.timestamp, row.victimPlayerId,
            row.attackerPlayerId, row.damageSource, row.damageAmount
        );

        if (row.roundId_round_id) {
            damage.roundIdObj = new TTTRound(
                row.roundId_round_id, row.roundId_round_mapName,
                row.roundId_round_startTime, row.roundId_round_endTime,
                row.roundId_round_winningTeam
            );
        }

        if (row.victimPlayerId_participant_id) {
            damage.victimPlayerIdObj = new TTTRoundParticipant(
                row.victimPlayerId_participant_id, row.victimPlayerId_participant_roundId,
                row.victimPlayerId_participant_playerId, row.victimPlayerId_participant_role,
                row.victimPlayerId_participant_oldRoles
            );
        }

        if (row.attackerPlayerId_participant_id) {
            damage.attackerPlayerIdObj = new TTTRoundParticipant(
                row.attackerPlayerId_participant_id, row.attackerPlayerId_participant_roundId,
                row.attackerPlayerId_participant_playerId, row.attackerPlayerId_participant_role,
                row.attackerPlayerId_participant_oldRoles
            );
        }
        return damage;
    }

    async getById(id) {
        const sql = `
            SELECT
                td._id, td.roundId, td.timestamp, td.victimPlayerId, td.attackerPlayerId,
                td.damageSource, td.damageAmount,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                tv._id AS victimPlayerId_participant_id, tv.roundId AS victimPlayerId_participant_roundId,
                tv.playerId AS victimPlayerId_participant_playerId, tv.role AS victimPlayerId_participant_role,
                tv.oldRoles AS victimPlayerId_participant_oldRoles,
                ta._id AS attackerPlayerId_participant_id, ta.roundId AS attackerPlayerId_participant_roundId,
                ta.playerId AS attackerPlayerId_participant_playerId, ta.role AS attackerPlayerId_participant_role,
                ta.oldRoles AS attackerPlayerId_participant_oldRoles
            FROM ttt_damage_logs td
            LEFT JOIN ttt_rounds tr ON td.roundId = tr._id
            LEFT JOIN ttt_round_participants tv ON td.victimPlayerId = tv._id
            LEFT JOIN ttt_round_participants ta ON td.attackerPlayerId = ta._id
            WHERE td._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching TTT damage log by ID with JOIN:', err.message);
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
                td._id, td.roundId, td.timestamp, td.victimPlayerId, td.attackerPlayerId,
                td.damageSource, td.damageAmount,
                tr._id AS roundId_round_id, tr.mapName AS roundId_round_mapName,
                tr.startTime AS roundId_round_startTime, tr.endTime AS roundId_round_endTime,
                tr.winningTeam AS roundId_round_winningTeam,
                tv._id AS victimPlayerId_participant_id, tv.roundId AS victimPlayerId_participant_roundId,
                tv.playerId AS victimPlayerId_participant_playerId, tv.role AS victimPlayerId_participant_role,
                tv.oldRoles AS victimPlayerId_participant_oldRoles,
                ta._id AS attackerPlayerId_participant_id, ta.roundId AS attackerPlayerId_participant_roundId,
                ta.playerId AS attackerPlayerId_participant_playerId, ta.role AS attackerPlayerId_participant_role,
                ta.oldRoles AS attackerPlayerId_participant_oldRoles
            FROM ttt_damage_logs td
            LEFT JOIN ttt_rounds tr ON td.roundId = tr._id
            LEFT JOIN ttt_round_participants tv ON td.victimPlayerId = tv._id
            LEFT JOIN ttt_round_participants ta ON td.attackerPlayerId = ta._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching all TTT damage logs with JOIN:', err.message);
                    reject(err);
                } else {
                    resolve(rows.map(this._mapJoinedRowToModel));
                }
            });
        });
    }
}
module.exports = TTTDamageDAO;