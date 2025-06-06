const { Schema, model } = require('mongoose');
const bankkontenSchema = new Schema({
    currentMoney: {
        type: Number,
        default: 0,
    },
    moneyGain: {
        type: Number,
        default: 0,
    },
    moneyLost: {
        type: Number,
        default: 0,
    },
    zinsProzent: {
        type: Number,
        default: 0,
    },
    besitzer: {
        type: Schema.Types.ObjectId,
        ref: 'GameUser',
        required: true,
        unique: true,
    }
});

module.exports = model('Bankkonten', bankkontenSchema);