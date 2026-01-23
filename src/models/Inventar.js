const { Schema, model } = require('mongoose');
const inventarSchema = new Schema({
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  besitzer: {
    type: Schema.Types.ObjectId,
    ref: 'GameUser',
    required: true,
    unique: true,
  },
});

module.exports = model('Inventar', inventarSchema);
