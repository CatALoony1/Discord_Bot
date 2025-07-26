class Gluecksrad {
    constructor(id, guildId, pool, sonderpool) {
        if (id && guildId && pool) { // 'guildId' and 'pool' are required
            // Full constructor
            this._id = id;
            this.guildId = guildId;
            this.pool = pool;
            this.sonderpool = sonderpool !== undefined ? sonderpool : 0;
        } else if (guildId && pool) {
            // Constructor with required fields
            this._id = null;
            this.guildId = guildId;
            this.pool = pool;
            this.sonderpool = 0;
        } else {
            // Empty constructor
            this._id = null;
            this.guildId = null;
            this.pool = null;
            this.sonderpool = 0;
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

    // Getter und Setter für pool
    getPool() {
        return this.pool;
    }

    setPool(pool) {
        this.pool = pool;
    }

    // Getter und Setter für sonderpool
    getSonderpool() {
        return this.sonderpool;
    }

    setSonderpool(sonderpool) {
        this.sonderpool = sonderpool;
    }

    toString() {
        return `Gluecksrad{id=${this._id}, guildId='${this.guildId}', pool=${this.pool}, sonderpool=${this.sonderpool}}`;
    }
}

module.exports = Gluecksrad;