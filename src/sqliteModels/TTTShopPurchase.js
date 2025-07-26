class TTTShopPurchase {
    constructor(id, roundId, timestamp, buyerId, itemName) {
        if (id && roundId && timestamp && buyerId && itemName) {
            // Full constructor
            this._id = id; // MongoDB _id
            this.roundId = roundId; // TTTRound foreign key (as string)
            // Store timestamp as ISO 8601 string
            this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
            this.buyerId = buyerId; // TTTRoundParticipant foreign key (as string)
            this.itemName = itemName;
            this.roundIdObj = null;
            this.buyerIdObj = null;
        } else if (roundId && timestamp && buyerId && itemName) {
            // Constructor matching Java's (without id)
            this._id = null;
            this.roundId = roundId;
            // Store timestamp as ISO 8601 string
            this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
            this.buyerId = buyerId;
            this.itemName = itemName;
            this.roundIdObj = null;
            this.buyerIdObj = null;
        } else {
            // Empty constructor
            this._id = null;
            this.roundId = null;
            this.timestamp = null;
            this.buyerId = null;
            this.itemName = null;
            this.roundIdObj = null;
            this.buyerIdObj = null;
        }
    }

    // Getter and Setter for _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter and Setter for roundId
    getRoundId() {
        return this.roundId;
    }

    setRoundId(roundId) {
        this.roundId = roundId;
    }

    // Getter for timestamp (returns Date object)
    getTimestamp() {
        return this.timestamp ? new Date(this.timestamp) : null;
    }

    // Setter for timestamp (stores as ISO 8601 string)
    setTimestamp(timestamp) {
        this.timestamp = (timestamp instanceof Date) ? timestamp.toISOString() : timestamp;
    }

    // Getter and Setter for buyerId
    getBuyerId() {
        return this.buyerId;
    }

    setBuyerId(buyerId) {
        this.buyerId = buyerId;
    }

    // Getter and Setter for itemName
    getItemName() {
        return this.itemName;
    }

    setItemName(itemName) {
        this.itemName = itemName;
    }

    
    getRoundIdObj() {
        return this.roundIdObj;
    }

    setRoundIdObj(roundIdObj) {
        this.roundIdObj = roundIdObj;
    }

    getBuyerIdObj() {
        return this.buyerIdObj;
    }

    setBuyerIdObj(buyerIdObj) {
        this.buyerIdObj = buyerIdObj;
    }

    toString() {
        return `ShopPurchase{id=${this._id}, roundId=${this.roundId}, timestamp=${this.timestamp}, buyerPlayerId=${this.buyerId}, itemDisplayName='${this.itemName}'}`;
    }
}

module.exports = TTTShopPurchase;