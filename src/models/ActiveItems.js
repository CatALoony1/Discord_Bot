const { Schema, model } = require('mongoose');

const activeItemsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    endTime: {
        type: Date,
    },
    itemType: {
        type: String,
        required: true,
    },
    user: {
        type: String,
    },
    usedOn: {
        type: String,
    },
    extras: {
        type: String,
    }
});

module.exports = model('ActiveItems', activeItemsSchema);