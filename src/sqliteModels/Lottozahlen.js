class Lottozahlen {
    constructor(id, guildId, drawnTime, lottozahl, userId) {
        if (id && guildId && drawnTime && lottozahl !== undefined && userId) { // Required fields
            // Full constructor
            this._id = id;
            this.guildId = guildId;
            // Speichere drawnTime als ISO 8601 String
            this.drawnTime = (drawnTime instanceof Date) ? drawnTime.toISOString() : drawnTime;
            this.lottozahl = lottozahl;
            this.userId = userId;
        } else if (guildId && drawnTime && lottozahl !== undefined && userId) {
            // Constructor with required fields
            this._id = null;
            this.guildId = guildId;
            this.drawnTime = (drawnTime instanceof Date) ? drawnTime.toISOString() : drawnTime;
            this.lottozahl = lottozahl;
            this.userId = userId;
        } else {
            // Empty constructor
            this._id = null;
            this.guildId = null;
            this.drawnTime = null;
            this.lottozahl = null;
            this.userId = null;
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

    // Getter für drawnTime (gibt Date-Objekt zurück)
    getDrawnTime() {
        return this.drawnTime ? new Date(this.drawnTime) : null;
    }

    // Setter für drawnTime (speichert als ISO 8601 String)
    setDrawnTime(drawnTime) {
        this.drawnTime = (drawnTime instanceof Date) ? drawnTime.toISOString() : drawnTime;
    }

    // Getter und Setter für lottozahl
    getLottozahl() {
        return this.lottozahl;
    }

    setLottozahl(lottozahl) {
        this.lottozahl = lottozahl;
    }

    // Getter und Setter für userId
    getUserId() {
        return this.userId;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    toString() {
        return `Lottozahlen{id=${this._id}, guildId='${this.guildId}', drawnTime=${this.drawnTime}, lottozahl=${this.lottozahl}, userId='${this.userId}'}`;
    }
}

module.exports = Lottozahlen;