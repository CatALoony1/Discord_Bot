const { Schema, model } = require('mongoose');

const configSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
});

module.exports = model('Config', configSchema);