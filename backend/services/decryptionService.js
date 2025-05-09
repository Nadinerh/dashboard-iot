// ✅ Nouveau decryptionService.js — dérivation de la clé compatible Raspberry
const crypto = require('crypto');
const { promisify } = require('util');
const pbkdf2 = promisify(crypto.pbkdf2);

const decryptData = async (encryptedBuffer) => {
  const password = process.env.AES_PASSWORD || 'nour';
  const salt = Buffer.from('iot-project-2025');

  const iv = encryptedBuffer.slice(0, 16);
  const ciphertext = encryptedBuffer.slice(16);

  const key = await pbkdf2(password, salt, 100000, 32, 'sha256');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted; // ← NE PAS .toString('utf8'), laisser le format brut au contrôleur upload.js
};

module.exports = { decryptData };


