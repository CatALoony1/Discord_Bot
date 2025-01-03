const { Schema, model } = require('mongoose');

const quizStatsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    right: {
        type: Number,
        default: 0,
    },
    wrong: {
        type: Number,
        default: 0,
    },
    lastParticipation: {
        type: Date,
        require: true,
    }
});

module.exports = model('QuizStats', quizStatsSchema);