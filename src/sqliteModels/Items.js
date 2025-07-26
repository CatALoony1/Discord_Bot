class Items {
    constructor(id, name, beschreibung, preis, boostOnly, available) {
        if (id && name && beschreibung && preis !== undefined) { // Required fields
            // Full constructor
            this._id = id;
            this.name = name;
            this.beschreibung = beschreibung;
            this.preis = preis;
            this.boostOnly = boostOnly !== undefined ? boostOnly : false;
            this.available = available !== undefined ? available : true;
        } else if (name && beschreibung && preis !== undefined) {
            // Constructor with required fields
            this._id = null;
            this.name = name;
            this.beschreibung = beschreibung;
            this.preis = preis;
            this.boostOnly = false;
            this.available = true;
        } else {
            // Empty constructor
            this._id = null;
            this.name = null;
            this.beschreibung = null;
            this.preis = null;
            this.boostOnly = false;
            this.available = true;
        }
    }

    // Getter und Setter für _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter und Setter für name
    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    // Getter und Setter für beschreibung
    getBeschreibung() {
        return this.beschreibung;
    }

    setBeschreibung(beschreibung) {
        this.beschreibung = beschreibung;
    }

    // Getter und Setter für preis
    getPreis() {
        return this.preis;
    }

    setPreis(preis) {
        this.preis = preis;
    }

    // Getter und Setter für boostOnly
    getBoostOnly() {
        return this.boostOnly;
    }

    setBoostOnly(boostOnly) {
        this.boostOnly = boostOnly;
    }

    // Getter und Setter für available
    getAvailable() {
        return this.available;
    }

    setAvailable(available) {
        this.available = available;
    }

    toString() {
        return `Items{id=${this._id}, name='${this.name}', beschreibung='${this.beschreibung}', preis=${this.preis}, boostOnly=${this.boostOnly}, available=${this.available}}`;
    }
}

module.exports = Items;