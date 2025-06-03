const { Schema, model } = require('mongoose');
const tiereSchema = new Schema({
    pfad: {
        type: String,
        required: true,
    },
    tierart: {
        type: String,
        required: true,
    },
    besitzer: {
        type: Schema.Types.ObjectId,
        ref: 'GameUser',
    }
});

module.exports = model('Tiere', tiereSchema);