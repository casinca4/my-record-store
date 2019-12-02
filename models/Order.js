const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  records: [
    {
      quantity: {
        type: Number,
        required: true
      },
      record: {
        type: Schema.Types.ObjectId,
        ref: 'Record'
      }
    }
  ]
});

module.exports = mongoose.model('Order', OrderSchema);
