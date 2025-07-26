class TTTPlayer {
    constructor(id, steamId, currentNickname) {
        if (id && steamId && currentNickname) {
            // Full constructor
            this._id = id; // MongoDB _id
            this.steamId = steamId;
            this.currentNickname = currentNickname;
        } else {
            // Empty constructor
            this._id = null;
            this.steamId = null;
            this.currentNickname = null;
        }
    }

    // Getter and Setter for _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter and Setter for steamId
    getSteamId() {
        return this.steamId;
    }

    setSteamId(steamId) {
        this.steamId = steamId;
    }

    // Getter and Setter for currentNickname
    getCurrentNickname() {
        return this.currentNickname;
    }

    setCurrentNickname(currentNickname) {
        this.currentNickname = currentNickname;
    }

    toString() {
        return `Player{id=${this._id}, steamId='${this.steamId}', currentNickname='${this.currentNickname}'}`;
    }
}

module.exports = TTTPlayer;