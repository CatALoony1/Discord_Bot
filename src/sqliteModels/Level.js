class Level {
    constructor(id, userId, guildId, xp, level, color, allxp, messages, lastMessage, userName, voicexp, messagexp, voicetime, thismonth, lastmonth, lastBump, geburtstag, bumps) {
        if (id && userId && guildId && lastMessage && userName) { // Required fields
            // Full constructor
            this._id = id;
            this.userId = userId;
            this.guildId = guildId;
            this.xp = xp !== undefined ? xp : 0;
            this.level = level !== undefined ? level : 0;
            this.color = color !== undefined ? color : '#e824b3';
            this.allxp = allxp !== undefined ? allxp : 0;
            this.messages = messages !== undefined ? messages : 0;
            // Speichere lastMessage als ISO 8601 String
            this.lastMessage = (lastMessage instanceof Date) ? lastMessage.toISOString() : lastMessage;
            this.userName = userName;
            this.voicexp = voicexp !== undefined ? voicexp : 0;
            this.messagexp = messagexp !== undefined ? messagexp : 0;
            this.voicetime = voicetime !== undefined ? voicetime : 0;
            this.thismonth = thismonth !== undefined ? thismonth : 0;
            this.lastmonth = lastmonth !== undefined ? lastmonth : 0;
            // Speichere lastBump als ISO 8601 String
            this.lastBump = (lastBump instanceof Date) ? lastBump.toISOString() : lastBump;
            // Speichere geburtstag als ISO 8601 String
            this.geburtstag = (geburtstag instanceof Date) ? geburtstag.toISOString() : geburtstag;
            this.bumps = bumps !== undefined ? bumps : 0;
        } else if (userId && guildId && lastMessage && userName) {
            // Constructor with required fields
            this._id = null;
            this.userId = userId;
            this.guildId = guildId;
            this.xp = 0;
            this.level = 0;
            this.color = '#e824b3';
            this.allxp = 0;
            this.messages = 0;
            this.lastMessage = (lastMessage instanceof Date) ? lastMessage.toISOString() : lastMessage;
            this.userName = userName;
            this.voicexp = 0;
            this.messagexp = 0;
            this.voicetime = 0;
            this.thismonth = 0;
            this.lastmonth = 0;
            this.lastBump = null;
            this.geburtstag = null;
            this.bumps = 0;
        } else {
            // Empty constructor
            this._id = null;
            this.userId = null;
            this.guildId = null;
            this.xp = 0;
            this.level = 0;
            this.color = '#e824b3';
            this.allxp = 0;
            this.messages = 0;
            this.lastMessage = null;
            this.userName = null;
            this.voicexp = 0;
            this.messagexp = 0;
            this.voicetime = 0;
            this.thismonth = 0;
            this.lastmonth = 0;
            this.lastBump = null;
            this.geburtstag = null;
            this.bumps = 0;
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

    // Getter und Setter für xp
    getXp() {
        return this.xp;
    }

    setXp(xp) {
        this.xp = xp;
    }

    // Getter und Setter für level
    getLevel() {
        return this.level;
    }

    setLevel(level) {
        this.level = level;
    }

    // Getter und Setter für color
    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
    }

    // Getter und Setter für allxp
    getAllxp() {
        return this.allxp;
    }

    setAllxp(allxp) {
        this.allxp = allxp;
    }

    // Getter und Setter für messages
    getMessages() {
        return this.messages;
    }

    setMessages(messages) {
        this.messages = messages;
    }

    // Getter für lastMessage (gibt Date-Objekt zurück)
    getLastMessage() {
        return this.lastMessage ? new Date(this.lastMessage) : null;
    }

    // Setter für lastMessage (speichert als ISO 8601 String)
    setLastMessage(lastMessage) {
        this.lastMessage = (lastMessage instanceof Date) ? lastMessage.toISOString() : lastMessage;
    }

    // Getter und Setter für userName
    getUserName() {
        return this.userName;
    }

    setUserName(userName) {
        this.userName = userName;
    }

    // Getter und Setter für voicexp
    getVoicexp() {
        return this.voicexp;
    }

    setVoicexp(voicexp) {
        this.voicexp = voicexp;
    }

    // Getter und Setter für messagexp
    getMessagexp() {
        return this.messagexp;
    }

    setMessagexp(messagexp) {
        this.messagexp = messagexp;
    }

    // Getter und Setter für voicetime
    getVoicetime() {
        return this.voicetime;
    }

    setVoicetime(voicetime) {
        this.voicetime = voicetime;
    }

    // Getter und Setter für thismonth
    getThismonth() {
        return this.thismonth;
    }

    setThismonth(thismonth) {
        this.thismonth = thismonth;
    }

    // Getter und Setter für lastmonth
    getLastmonth() {
        return this.lastmonth;
    }

    setLastmonth(lastmonth) {
        this.lastmonth = lastmonth;
    }

    // Getter für lastBump (gibt Date-Objekt zurück)
    getLastBump() {
        return this.lastBump ? new Date(this.lastBump) : null;
    }

    // Setter für lastBump (speichert als ISO 8601 String)
    setLastBump(lastBump) {
        this.lastBump = (lastBump instanceof Date) ? lastBump.toISOString() : lastBump;
    }

    // Getter für geburtstag (gibt Date-Objekt zurück)
    getGeburtstag() {
        return this.geburtstag ? new Date(this.geburtstag) : null;
    }

    // Setter für geburtstag (speichert als ISO 8601 String)
    setGeburtstag(geburtstag) {
        this.geburtstag = (geburtstag instanceof Date) ? geburtstag.toISOString() : geburtstag;
    }

    // Getter und Setter für bumps
    getBumps() {
        return this.bumps;
    }

    setBumps(bumps) {
        this.bumps = bumps;
    }

    toString() {
        return `Level{id=${this._id}, userId='${this.userId}', guildId='${this.guildId}', xp=${this.xp}, level=${this.level}, color='${this.color}', allxp=${this.allxp}, messages=${this.messages}, lastMessage=${this.lastMessage}, userName='${this.userName}', voicexp=${this.voicexp}, messagexp=${this.messagexp}, voicetime=${this.voicetime}, thismonth=${this.thismonth}, lastmonth=${this.lastmonth}, lastBump=${this.lastBump}, geburtstag=${this.geburtstag}, bumps=${this.bumps}}`;
    }
}

module.exports = Level;