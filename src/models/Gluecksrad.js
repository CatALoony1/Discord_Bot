const { Schema, model } = require('mongoose');

const gluecksradSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  pool: {
    type: Number,
    required: true,
  },
});

module.exports = model('gluecksrad', gluecksradSchema);