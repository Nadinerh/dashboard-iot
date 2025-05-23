const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  resetToken: String,
  resetTokenExpiration: Date,
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

