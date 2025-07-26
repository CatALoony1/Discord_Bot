class TTTDamage {
    constructor(id, roundId, timestamp, victimPlayerId, attackerPlayerId, damageSource, damageAmount) {
        if (id && roundId && timestamp && victimPlayerId && attackerPlayerId && damageSource && damageAmount) {
            // Full constructor
            this._id = id; // MongoDB _id
            this.roundId = roundId;
            // Store timestamp as ISO 8601 string
            this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
            this.victimPlayerId = victimPlayerId; // foreign key tttroundparticipant
            this.attackerPlayerId = attackerPlayerId;// foreign key tttroundparticipant
            this.damageSource = damageSource;
            this.damageAmount = damageAmount;
            this.roundIdObj = null;
            this.victimPlayerIdObj = null;
            this.attackerPlayerIdObj = null;
        } else if (roundId && timestamp && victimPlayerId && attackerPlayerId && damageSource && damageAmount) {
            // Constructor matching Java's (without id)
            this._id = null;
            this.roundId = roundId;
            // Store timestamp as ISO 8601 string
            this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
            this.victimPlayerId = victimPlayerId;
            this.attackerPlayerId = attackerPlayerId;
            this.damageSource = damageSource;
            this.damageAmount = damageAmount;
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
            this.damageSource = null;
            this.damageAmount = null;
            this.roundIdObj = null;
            this.victimPlayerIdObj = null;
            this.attackerPlayerIdObj = null;
        }
    }

    // Getter und Setter
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

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

    getVictimPlayerId() {
        return this.victimPlayerId;
    }

    setVictimPlayerId(victimPlayerId) {
        this.victimPlayerId = victimPlayerId;
    }

    getAttackerPlayerId() {
        return this.attackerPlayerId;
    }

    setAttackerPlayerId(attackerPlayerId) {
        this.attackerPlayerId = attackerPlayerId;
    }

    getDamageSource() {
        return this.damageSource;
    }

    setDamageSource(damageSource) {
        this.damageSource = damageSource;
    }

    getDamageAmount() {
        return this.damageAmount;
    }

    setDamageAmount(damageAmount) {
        this.damageAmount = damageAmount;
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

    @override
    toString() {
        return `DamageLog{id=${this._id}, roundId=${this.roundId}, timestamp=${this.timestamp}, victimPlayerId=${this.victimPlayerId}, attackerPlayerId=${this.attackerPlayerId}, weaponSource='${this.damageSource}', damageAmount=${this.damageAmount}}`;
    }
}

module.exports = TTTDamage;