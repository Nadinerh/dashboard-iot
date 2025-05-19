// models/Detection.js
const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  timestamp: String,
  prediction: Number, // 0 = Normal, 1 = DDoS
});

module.exports = mongoose.model('Detection', detectionSchema);

