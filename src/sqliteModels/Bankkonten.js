class Bankkonten {
    constructor(id, currentMoney, moneyGain, moneyLost, zinsProzent, besitzer) {
        if (id && besitzer) { // 'besitzer' is required
            // Full constructor
            this._id = id;
            this.currentMoney = currentMoney !== undefined ? currentMoney : 0;
            this.moneyGain = moneyGain !== undefined ? moneyGain : 0;
            this.moneyLost = moneyLost !== undefined ? moneyLost : 0;
            this.zinsProzent = zinsProzent !== undefined ? zinsProzent : 0;
            this.besitzer = besitzer; // Foreign key as String
            this.besitzerObj = null;
        } else if (besitzer) {
            // Constructor with required field 'besitzer'
            this._id = null;
            this.currentMoney = 0;
            this.moneyGain = 0;
            this.moneyLost = 0;
            this.zinsProzent = 0;
            this.besitzer = besitzer;
            this.besitzerObj = null;
        } else {
            // Empty constructor
            this._id = null;
            this.currentMoney = 0;
            this.moneyGain = 0;
            this.moneyLost = 0;
            this.zinsProzent = 0;
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

    // Getter und Setter für currentMoney
    getCurrentMoney() {
        return this.currentMoney;
    }

    setCurrentMoney(currentMoney) {
        this.currentMoney = currentMoney;
    }

    // Getter und Setter für moneyGain
    getMoneyGain() {
        return this.moneyGain;
    }

    setMoneyGain(moneyGain) {
        this.moneyGain = moneyGain;
    }

    // Getter und Setter für moneyLost
    getMoneyLost() {
        return this.moneyLost;
    }

    setMoneyLost(moneyLost) {
        this.moneyLost = moneyLost;
    }

    // Getter und Setter für zinsProzent
    getZinsProzent() {
        return this.zinsProzent;
    }

    setZinsProzent(zinsProzent) {
        this.zinsProzent = zinsProzent;
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
        return `Bankkonten{id=${this._id}, currentMoney=${this.currentMoney}, moneyGain=${this.moneyGain}, moneyLost=${this.moneyLost}, zinsProzent=${this.zinsProzent}, besitzer='${this.besitzer}'}`;
    }
}

module.exports = Bankkonten;