class GameUser {
    constructor(id, userId, guildId, quizadded, daily, weight) {
        if (id && userId) { // 'userId' is required
            // Full constructor
            this._id = id;
            this.userId = userId;
            this.guildId = guildId !== undefined ? guildId : null;
            this.quizadded = quizadded !== undefined ? quizadded : 0;
            // Speichere daily als ISO 8601 String
            this.daily = (daily instanceof Date) ? daily.toISOString() : daily;
            this.weight = weight !== undefined ? weight : 0;
        } else if (userId) {
            // Constructor with required field 'userId'
            this._id = null;
            this.userId = userId;
            this.guildId = null;
            this.quizadded = 0;
            this.daily = null;
            this.weight = 0;
        } else {
            // Empty constructor
            this._id = null;
            this.userId = null;
            this.guildId = null;
            this.quizadded = 0;
            this.daily = null;
            this.weight = 0;
        }
    }

    // Getter und Setter für _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter und Setter für userId
    getUserId() {
        return this.userId;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    // Getter und Setter für guildId
    getGuildId() {
        return this.guildId;
    }

    setGuildId(guildId) {
        this.guildId = guildId;
    }

    // Getter und Setter für quizadded
    getQuizadded() {
        return this.quizadded;
    }

    setQuizadded(quizadded) {
        this.quizadded = quizadded;
    }

    // Getter für daily (gibt Date-Objekt zurück)
    getDaily() {
        return this.daily ? new Date(this.daily) : null;
    }

    // Setter für daily (speichert als ISO 8601 String)
    setDaily(daily) {
        this.daily = (daily instanceof Date) ? daily.toISOString() : daily;
    }

    // Getter und Setter für weight
    getWeight() {
        return this.weight;
    }

    setWeight(weight) {
        this.weight = weight;
    }

    toString() {
        return `GameUser{id=${this._id}, userId='${this.userId}', guildId='${this.guildId}', quizadded=${this.quizadded}, daily=${this.daily}, weight=${this.weight}}`;
    }
}

module.exports = GameUser;