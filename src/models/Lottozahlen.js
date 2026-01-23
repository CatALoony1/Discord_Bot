const { Schema, model } = require('mongoose');

const lottozahlenSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  drawnTime: {
    type: Date,
    required: true,
  },
  lottozahl: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = model('Lottozahlen', lottozahlenSchema);
