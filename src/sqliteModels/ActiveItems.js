class ActiveItems {
    constructor(id, guildId, endTime, itemType, user, usedOn, extras) {
        if (id && guildId && itemType) {
            // Full constructor
            this._id = id;
            this.guildId = guildId;
            // Speichere endTime als ISO 8601 String
            this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
            this.itemType = itemType;
            this.user = user;
            this.usedOn = usedOn;
            this.extras = extras;
        } else if (guildId && itemType) {
            // Partial constructor based on required fields
            this._id = null;
            this.guildId = guildId;
            this.endTime = null; // Default for optional Date field
            this.itemType = itemType;
            this.user = null;
            this.usedOn = null;
            this.extras = null;
        } else {
            // Empty constructor
            this._id = null;
            this.guildId = null;
            this.endTime = null;
            this.itemType = null;
            this.user = null;
            this.usedOn = null;
            this.extras = null;
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

    // Getter und Setter für itemType
    getItemType() {
        return this.itemType;
    }

    setItemType(itemType) {
        this.itemType = itemType;
    }

    // Getter und Setter für user
    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    // Getter und Setter für usedOn
    getUsedOn() {
        return this.usedOn;
    }

    setUsedOn(usedOn) {
        this.usedOn = usedOn;
    }

    // Getter und Setter für extras
    getExtras() {
        return this.extras;
    }

    setExtras(extras) {
        this.extras = extras;
    }

    toString() {
        return `ActiveItems{id=${this._id}, guildId='${this.guildId}', endTime=${this.endTime}, itemType='${this.itemType}', user='${this.user}', usedOn='${this.usedOn}', extras='${this.extras}'}`;
    }
}

module.exports = ActiveItems;