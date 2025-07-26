class TTTRoundParticipant {
    constructor(id, roundId, playerId, role, oldRoles) {
        if (id && roundId && playerId && role && oldRoles) {
            // Full constructor
            this._id = id; // MongoDB _id
            this.roundId = roundId; // TTTRound foreign key (as string)
            this.playerId = playerId; // TTTPlayer foreign key (as string)
            this.role = role;
            this.oldRoles = oldRoles;
            this.roundIdObj = null;
            this.playerIdObj = null;
        } else if (roundId && playerId && role) {
            // Constructor matching Java's (without id and setting oldRoles)
            this._id = null;
            this.roundId = roundId;
            this.playerId = playerId;
            this.role = role;
            this.oldRoles = role; // Initialized with current role
            this.roundIdObj = null;
            this.playerIdObj = null;
        } else {
            // Empty constructor
            this._id = null;
            this.roundId = null;
            this.playerId = null;
            this.role = null;
            this.oldRoles = null;
            this.roundIdObj = null;
            this.playerIdObj = null;
        }
    }

    // Getter and Setter for _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter and Setter for roundId
    getRoundId() {
        return this.roundId;
    }

    setRoundId(roundId) {
        this.roundId = roundId;
    }

    // Getter and Setter for playerId
    getPlayerId() {
        return this.playerId;
    }

    setPlayerId(playerId) {
        this.playerId = playerId;
    }

    // Getter and Setter for role
    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }

    // Getter and Setter for oldRoles
    getOldRoles() {
        return this.oldRoles;
    }

    setOldRoles(oldRoles) {
        this.oldRoles = oldRoles;
    }

    getRoundIdObj() {
        return this.roundIdObj;
    }

    setRoundIdObj(roundIdObj) {
        this.roundIdObj = roundIdObj;
    }

    getPlayerIdObj() {
        return this.playerIdObj;
    }

    setPlayerIdObj(playerIdObj) {
        this.playerIdObj = playerIdObj;
    }

    toString() {
        return `RoundParticipant{id=${this._id}, roundId=${this.roundId}, playerId=${this.playerId}, role='${this.role}', oldRoles='${this.oldRoles}'}`;
    }
}

module.exports = TTTRoundParticipant;