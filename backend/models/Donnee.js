const mongoose = require('mongoose');

const donneeSchema = new mongoose.Schema({
  temp: Number,
  hum: Number,
  hmac: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donnee', donneeSchema);
