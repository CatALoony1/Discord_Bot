class Bump {
    constructor(id, guildId, endTime, reminded, remindedId) {
        if (id && guildId && endTime) {
            // Full constructor
            this._id = id;
            this.guildId = guildId;
            // Speichere endTime als ISO 8601 String
            this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
            this.reminded = reminded !== undefined ? reminded : 'N';
            this.remindedId = remindedId;
        } else if (guildId && endTime) {
            // Constructor with required fields
            this._id = null;
            this.guildId = guildId;
            this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
            this.reminded = 'N';
            this.remindedId = null;
        } else {
            // Empty constructor
            this._id = null;
            this.guildId = null;
            this.endTime = null;
            this.reminded = 'N';
            this.remindedId = null;
        }
    }

    // Getter und Setter für _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter und Setter für guildId
    getGuildId() {
        return this.guildId;
    }

    setGuildId(guildId) {
        this.guildId = guildId;
    }

    // Getter für endTime (gibt Date-Objekt zurück)
    getEndTime() {
        return this.endTime ? new Date(this.endTime) : null;
    }

    // Setter für endTime (speichert als ISO 8601 String)
    setEndTime(endTime) {
        this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
    }

    // Getter und Setter für reminded
    getReminded() {
        return this.reminded;
    }

    setReminded(reminded) {
        this.reminded = reminded;
    }

    // Getter und Setter für remindedId
    getRemindedId() {
        return this.remindedId;
    }

    setRemindedId(remindedId) {
        this.remindedId = remindedId;
    }

    toString() {
        return `Bump{id=${this._id}, guildId='${this.guildId}', endTime=${this.endTime}, reminded='${this.reminded}', remindedId='${this.remindedId}'}`;
    }
}

module.exports = Bump;