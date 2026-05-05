const { Schema, model } = require('mongoose');
const voiceChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nutzer: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  permanent: {
    type: Boolean,
    default: false,
  },
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    required: true,
  },
});

module.exports = model('VoiceChannel', voiceChannelSchema);
