const { Schema, model } = require('mongoose');

const hangmanSchema = new Schema({
  authorId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  word: {
    type: String,
    required: true,
  },
  status: {
    //laufend, beendet
    type: String,
    default: "laufend",
  },
  buchstaben: {
    type: [String],
    default: [],
  },
  fehler: {
    type: Number,
    default: 0,
  },
  participants: {
    type: [String],
    default: [],
  },
});

module.exports = model('Hangman', hangmanSchema);