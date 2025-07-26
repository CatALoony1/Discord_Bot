class Tiere {
    constructor(id, pfad, tierart, customName, besitzer) {
        if (id && pfad && tierart) { // Required fields: pfad, tierart
            // Full constructor
            this._id = id;
            this.pfad = pfad;
            this.tierart = tierart;
            this.customName = customName !== undefined ? customName : null;
            this.besitzer = besitzer !== undefined ? besitzer : null; // Foreign key as String
            this.besitzerObj = null;
        } else if (pfad && tierart) {
            // Constructor with required fields
            this._id = null;
            this.pfad = pfad;
            this.tierart = tierart;
            this.customName = null;
            this.besitzer = null;
            this.besitzerObj = null;
        } else {
            // Empty constructor
            this._id = null;
            this.pfad = null;
            this.tierart = null;
            this.customName = null;
            this.besitzer = null;
            this.besitzerObj = null;
        }
    }

    // Getter und Setter für _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter und Setter für pfad
    getPfad() {
        return this.pfad;
    }

    setPfad(pfad) {
        this.pfad = pfad;
    }

    // Getter und Setter für tierart
    getTierart() {
        return this.tierart;
    }

    setTierart(tierart) {
        this.tierart = tierart;
    }

    // Getter und Setter für customName
    getCustomName() {
        return this.customName;
    }

    setCustomName(customName) {
        this.customName = customName;
    }

    // Getter und Setter für besitzer (Foreign Key)
    getBesitzer() {
        return this.besitzer;
    }

    setBesitzer(besitzer) {
        this.besitzer = besitzer;
    }

    // Getter und Setter für das GameUser-Objekt
    getBesitzerObj() {
        return this.besitzerObj;
    }

    setBesitzerObj(besitzerObj) {
        this.besitzerObj = besitzerObj;
    }

    toString() {
        return `Tiere{id=${this._id}, pfad='${this.pfad}', tierart='${this.tierart}', customName='${this.customName}', besitzer='${this.besitzer}'}`;
    }
}

module.exports = Tiere;