class TTTRound {
    constructor(id, mapName, startTime, endTime, winningTeam) {
        if (id && mapName && startTime && endTime && winningTeam) {
            // Full constructor
            this._id = id; // MongoDB _id
            this.mapName = mapName;
            // Store timestamps as ISO 8601 strings
            this.startTime = (startTime instanceof Date) ? startTime.toISOString() : startTime;
            this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
            this.winningTeam = winningTeam;
        } else if (mapName && startTime && endTime && winningTeam) {
            // Constructor matching Java's (without id)
            this._id = null;
            this.mapName = mapName;
            // Store timestamps as ISO 8601 strings
            this.startTime = (startTime instanceof Date) ? startTime.toISOString() : startTime;
            this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
            this.winningTeam = winningTeam;
        } else {
            // Empty constructor
            this._id = null;
            this.mapName = null;
            this.startTime = null;
            this.endTime = null;
            this.winningTeam = null;
        }
    }

    // Getter and Setter for _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter and Setter for mapName
    getMapName() {
        return this.mapName;
    }

    setMapName(mapName) {
        this.mapName = mapName;
    }

    // Getter for startTime (returns Date object)
    getStartTime() {
        return this.startTime ? new Date(this.startTime) : null;
    }

    // Setter for startTime (stores as ISO 8601 string)
    setStartTime(startTime) {
        this.startTime = (startTime instanceof Date) ? startTime.toISOString() : startTime;
    }

    // Getter for endTime (returns Date object)
    getEndTime() {
        return this.endTime ? new Date(this.endTime) : null;
    }

    // Setter for endTime (stores as ISO 8601 string)
    setEndTime(endTime) {
        this.endTime = (endTime instanceof Date) ? endTime.toISOString() : endTime;
    }

    // Getter and Setter for winningTeam
    getWinningTeam() {
        return this.winningTeam;
    }

    setWinningTeam(winningTeam) {
        this.winningTeam = winningTeam;
    }

    toString() {
        return `Round{id=${this._id}, mapName='${this.mapName}', startTime=${this.startTime}, endTime=${this.endTime}, winningTeam='${this.winningTeam}'}`;
    }
}

module.exports = TTTRound;