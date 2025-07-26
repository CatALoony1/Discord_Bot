class TTTKill {
    constructor(id, roundId, timestamp, victimPlayerId, attackerPlayerId, causeOfDeath) {
        if (id && roundId && timestamp && victimPlayerId && attackerPlayerId && causeOfDeath) {
            // Full constructor
            this._id = id; // MongoDB _id
            this.roundId = roundId; // TTTRound foreign key (as string)
            // Store timestamp as ISO 8601 string
            this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
            this.victimPlayerId = victimPlayerId; // TTTRoundParticipant foreign key (as string)
            this.attackerPlayerId = attackerPlayerId; // TTTRoundParticipant foreign key (as string)
            this.causeOfDeath = causeOfDeath;
            this.roundIdObj = null;
            this.victimPlayerIdObj = null;
            this.attackerPlayerIdObj = null;
        } else if (roundId && timestamp && victimPlayerId && attackerPlayerId && causeOfDeath) {
            // Constructor matching Java's (without id)
            this._id = null;
            this.roundId = roundId;
            // Store timestamp as ISO 8601 string
            this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
            this.victimPlayerId = victimPlayerId;
            this.attackerPlayerId = attackerPlayerId;
            this.causeOfDeath = causeOfDeath;
            this.roundIdObj = null;
            this.victimPlayerIdObj = null;
            this.attackerPlayerIdObj = null;
        } else {
            // Empty constructor
            this._id = null;
            this.roundId = null;
            this.timestamp = null;
            this.victimPlayerId = null;
            this.attackerPlayerId = null;
            this.causeOfDeath = null;
            this.roundIdObj = null;
            this.victimPlayerIdObj = null;
            this.attackerPlayerIdObj = null;
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

    // Getter for timestamp (returns Date object)
    getTimestamp() {
        return this.timestamp ? new Date(this.timestamp) : null;
    }

    // Setter for timestamp (stores as ISO 8601 string)
    setTimestamp(timestamp) {
        this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
    }

    // Getter and Setter for victimPlayerId
    getVictimPlayerId() {
        return this.victimPlayerId;
    }

    setVictimPlayerId(victimPlayerId) {
        this.victimPlayerId = victimPlayerId;
    }

    // Getter and Setter for attackerPlayerId
    getAttackerPlayerId() {
        return this.attackerPlayerId;
    }

    setAttackerPlayerId(attackerPlayerId) {
        this.attackerPlayerId = attackerPlayerId;
    }

    // Getter and Setter for causeOfDeath
    getCauseOfDeath() {
        return this.causeOfDeath;
    }

    setCauseOfDeath(causeOfDeath) {
        this.causeOfDeath = causeOfDeath;
    }

    getRoundIdObj() {
        return this.roundIdObj;
    }

    setRoundIdObj(roundIdObj) {
        this.roundIdObj = roundIdObj;
    }

    getVictimPlayerIdObj() {
        return this.victimPlayerIdObj;
    }

    setVictimPlayerIdObj(victimPlayerIdObj) {
        this.victimPlayerIdObj = victimPlayerIdObj;
    }

    getAttackerPlayerIdObj() {
        return this.attackerPlayerIdObj;
    }

    setAttackerPlayerIdObj(attackerPlayerIdObj) {
        this.attackerPlayerIdObj = attackerPlayerIdObj;
    }

    toString() {
        return `Kill{id=${this._id}, roundId=${this.roundId}, timestamp=${this.timestamp}, victimPlayerId=${this.victimPlayerId}, attackerPlayerId=${this.attackerPlayerId}, causeOfDeath='${this.causeOfDeath}'}`;
    }
}

module.exports = TTTKill;