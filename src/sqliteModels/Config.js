class Config {
    constructor(id, guildId, key, value) {
        if (id && guildId && key && value) {
            // Full constructor
            this._id = id;
            this.guildId = guildId;
            this.key = key;
            this.value = value;
        } else if (guildId && key && value) {
            // Constructor with required fields
            this._id = null;
            this.guildId = guildId;
            this.key = key;
            this.value = value;
        } else {
            // Empty constructor
            this._id = null;
            this.guildId = null;
            this.key = null;
            this.value = null;
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

    // Getter und Setter für key
    getKey() {
        return this.key;
    }

    setKey(key) {
        this.key = key;
    }

    // Getter und Setter für value
    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    toString() {
        return `Config{id=${this._id}, guildId='${this.guildId}', key='${this.key}', value='${this.value}'}`;
    }
}

module.exports = Config;