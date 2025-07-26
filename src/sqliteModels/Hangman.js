class Hangman {
    constructor(id, authorId, guildId, messageId, word, status, buchstaben, fehler, participants) {
        if (id && authorId && guildId && messageId && word) { // Required fields
            // Full constructor
            this._id = id;
            this.authorId = authorId;
            this.guildId = guildId;
            this.messageId = messageId;
            this.word = word;
            this.status = status !== undefined ? status : "laufend";
            this.buchstaben = buchstaben !== undefined ? buchstaben : [];
            this.fehler = fehler !== undefined ? fehler : 0;
            this.participants = participants !== undefined ? participants : [];
        } else if (authorId && guildId && messageId && word) {
            // Constructor with required fields
            this._id = null;
            this.authorId = authorId;
            this.guildId = guildId;
            this.messageId = messageId;
            this.word = word;
            this.status = "laufend";
            this.buchstaben = [];
            this.fehler = 0;
            this.participants = [];
        } else {
            // Empty constructor
            this._id = null;
            this.authorId = null;
            this.guildId = null;
            this.messageId = null;
            this.word = null;
            this.status = "laufend";
            this.buchstaben = [];
            this.fehler = 0;
            this.participants = [];
        }
    }

    // Getter und Setter für _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter und Setter für authorId
    getAuthorId() {
        return this.authorId;
    }

    setAuthorId(authorId) {
        this.authorId = authorId;
    }

    // Getter und Setter für guildId
    getGuildId() {
        return this.guildId;
    }

    setGuildId(guildId) {
        this.guildId = guildId;
    }

    // Getter und Setter für messageId
    getMessageId() {
        return this.messageId;
    }

    setMessageId(messageId) {
        this.messageId = messageId;
    }

    // Getter und Setter für word
    getWord() {
        return this.word;
    }

    setWord(word) {
        this.word = word;
    }

    // Getter und Setter für status
    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    // Getter und Setter für buchstaben
    getBuchstaben() {
        return this.buchstaben;
    }

    setBuchstaben(buchstaben) {
        this.buchstaben = buchstaben;
    }

    // Getter und Setter für fehler
    getFehler() {
        return this.fehler;
    }

    setFehler(fehler) {
        this.fehler = fehler;
    }

    // Getter und Setter für participants
    getParticipants() {
        return this.participants;
    }

    setParticipants(participants) {
        this.participants = participants;
    }

    toString() {
        return `Hangman{id=${this._id}, authorId='${this.authorId}', guildId='${this.guildId}', messageId='${this.messageId}', word='${this.word}', status='${this.status}', buchstaben=[${this.buchstaben.join(', ')}], fehler=${this.fehler}, participants=[${this.participants.join(', ')}]}`;
    }
}

module.exports = Hangman;