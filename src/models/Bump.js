const { Schema, model } = require('mongoose');

const bumpSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  endTime: {
    type: Date,
    require: true,
  },
  reminded: {
    type: String,
    default: 'N',
  },
  remindedId: {
    type: String,
  }
});

module.exports = model('Bump', bumpSchema);