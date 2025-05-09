const mongoose = require('mongoose');

const encryptedDataSchema = new mongoose.Schema({
  encryptedContent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  decryptedContent: { type: String },
  status: { type: String, enum: ['pending', 'decrypted', 'error'], default: 'pending' }
});

module.exports = mongoose.model('EncryptedData', encryptedDataSchema);
