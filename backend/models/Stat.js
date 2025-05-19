const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  type: String,         // ex: "DDoS"
  ip: String,           // IP source
  detail: String,       // message comme "détection via rate limit"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Stat", statSchema);

