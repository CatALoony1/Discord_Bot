const { Schema, model } = require('mongoose');

const botStateSchema = new Schema({
  guildId: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    default: 'neutral',
  },
  loveCount: {
    type: Number,
    default: 0,
  },
  evilCount: {
    type: Number,
    default: 0,
  },
  hornyCount: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
  }
});

module.exports = model('BotState', botStateSchema);