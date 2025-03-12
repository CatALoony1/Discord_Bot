const { Schema, model } = require('mongoose');

const begruessungSchema = new Schema({
    authorId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    webhookId: {
        type: String,
        required: true,
        unique: true,
    },
    webhookToken: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    zugestimmt: {
        type: String,
        default: "X",
    },
});

module.exports = model('Begruessung', begruessungSchema);