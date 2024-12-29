const { Schema, model } = require('mongoose');

const configSchema = new Schema({
  key: {
    type: String,
    require: true,
  },
  value: {
    type: String,
    require: true,
  }
});

module.exports = model('Config', configSchema);