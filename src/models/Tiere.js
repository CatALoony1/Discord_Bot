const { Schema, model } = require('mongoose');
const tiereSchema = new Schema({
  pfad: {
    type: String,
    required: true,
  },
  tierart: {
    type: String,
    required: true,
  },
  customName: {
    type: String,
    required: false,
  },
  besitzer: {
    type: Schema.Types.ObjectId,
    ref: 'GameUser',
  },
});

module.exports = model('Tiere', tiereSchema);
