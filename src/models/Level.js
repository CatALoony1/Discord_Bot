const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#e824b3',
  },
  allxp: {
    type: Number,
    default: 0,
  },
  messages: {
    type: Number,
    default: 0,
  },
  lastMessage: {
    type: Date,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  voicexp: {
    type: Number,
    default: 0,
  },
  messagexp: {
    type: Number,
    default: 0,
  },
  voicetime: {
    type: Number,
    default: 0,
  },
  thismonth: {
    type: Number,
    default: 0,
  },
  lastmonth: {
    type: Number,
    default: 0,
  },
  bonusclaimed: {
    type: Number,
    default: 0,
  },
  quizadded: {
    type: Number,
    default: 0,
  },
  lastBump: {
    type: Date,
  },
  removedxp: {
    type: Number,
    default: 0,
  },
  geburtstag: {
    type: Date,
  }
});

module.exports = model('Level', levelSchema);
