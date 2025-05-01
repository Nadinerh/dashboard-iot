const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },

  // Champs pour la réinitialisation de mot de passe
  resetToken: String,
  resetTokenExpiration: Date
});

module.exports = mongoose.model('User', userSchema);

