const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto');

const suggestionSchema = new Schema({
  suggestionId: {
    type: String,
    default: randomUUID,
  },
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
  content: {
    type: String,
    required: true,
  },
  status: {
    //laufend, zugestimmt, abgelehnt
    type: String,
    default: "laufend",
  },
  upvotes: {
    type: [String],
    default: [],
  },
  downvotes: {
    type: [String],
    default: [],
  },
});

module.exports = model('Suggestion', suggestionSchema);