const { Schema, model } = require('mongoose');

const webUserSchema = new Schema({
  guildIds: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = model('WebUser', webUserSchema);
