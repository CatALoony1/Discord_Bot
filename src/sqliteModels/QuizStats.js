class QuizStats {
    constructor(id, guildId, userId, right, wrong, lastParticipation, series) {
        if (id && guildId && userId && lastParticipation) { // Required fields
            // Full constructor
            this._id = id;
            this.guildId = guildId;
            this.userId = userId;
            this.right = right !== undefined ? right : 0;
            this.wrong = wrong !== undefined ? wrong : 0;
            // Speichere lastParticipation als ISO 8601 String
            this.lastParticipation = (lastParticipation instanceof Date) ? lastParticipation.toISOString() : lastParticipation;
            this.series = series !== undefined ? series : 0;
        } else if (guildId && userId && lastParticipation) {
            // Constructor with required fields
            this._id = null;
            this.guildId = guildId;
            this.userId = userId;
            this.right = 0;
            this.wrong = 0;
            this.lastParticipation = (lastParticipation instanceof Date) ? lastParticipation.toISOString() : lastParticipation;
            this.series = 0;
        } else {
            // Empty constructor
            this._id = null;
            this.guildId = null;
            this.userId = null;
            this.right = 0;
            this.wrong = 0;
            this.lastParticipation = null;
            this.series = 0;
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

    // Getter und Setter für userId
    getUserId() {
        return this.userId;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    // Getter und Setter für right
    getRight() {
        return this.right;
    }

    setRight(right) {
        this.right = right;
    }

    // Getter und Setter für wrong
    getWrong() {
        return this.wrong;
    }

    setWrong(wrong) {
        this.wrong = wrong;
    }

    // Getter für lastParticipation (gibt Date-Objekt zurück)
    getLastParticipation() {
        return this.lastParticipation ? new Date(this.lastParticipation) : null;
    }

    // Setter für lastParticipation (speichert als ISO 8601 String)
    setLastParticipation(lastParticipation) {
        this.lastParticipation = (lastParticipation instanceof Date) ? lastParticipation.toISOString() : lastParticipation;
    }

    // Getter und Setter für series
    getSeries() {
        return this.series;
    }

    setSeries(series) {
        this.series = series;
    }

    toString() {
        return `QuizStats{id=${this._id}, guildId='${this.guildId}', userId='${this.userId}', right=${this.right}, wrong=${this.wrong}, lastParticipation=${this.lastParticipation}, series=${this.series}}`;
    }
}

module.exports = QuizStats;