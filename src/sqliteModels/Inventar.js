class Inventar {
    constructor(id, items, besitzer) {
        if (id && besitzer) { // 'besitzer' is required
            // Full constructor
            this._id = id;
            // Stelle sicher, dass items ein Array ist und die enthaltenen items
            this.items = items; //`items` wird ein Array von Objekten sein, z.B. [{ itemId: 'item_id', amount: 3, itemObj: null }]
            this.besitzer = besitzer; // Foreign key as String
            this.besitzerObj = null;
        } else if (besitzer) {
            // Constructor with required field 'besitzer'
            this._id = null;
            this.items = [];
            this.besitzer = besitzer;
            this.besitzerObj = null;
        } else {
            // Empty constructor
            this._id = null;
            this.items = [];
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

    // Getter und Setter für items
    getItems() {
        return this.items;
    }

    setItems(items) {
        this.items = Array.isArray(items) ? items.map(i => ({
            item: String(i.item),
            quantity: i.quantity !== undefined ? i.quantity : 1
        })) : [];
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
        return `Inventar{id=${this._id}, items=${JSON.stringify(this.items)}, besitzer='${this.besitzer}'}`;
    }
}

module.exports = Inventar;