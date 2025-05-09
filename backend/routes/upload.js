const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path");
const fs = require("fs").promises;
const Donnee = require("../models/Donnee");
const { decryptData } = require('../services/decryptionService'); // ✅ Déchiffrement centralisé

// Configuration du stockage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    require("fs").mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'encrypted_sensor_data.enc');
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    console.log('📥 Fichier reçu:', req.file.path);

    // Lire le contenu du fichier binaire
    const fileContent = await fs.readFile(req.file.path);

    // Utiliser le service de déchiffrement
    const decryptedBuffer = await decryptData(fileContent);
    const decrypted = decryptedBuffer.toString('utf8');

    // Parser le CSV déchiffré
    const lines = decrypted.split('\n').filter(Boolean);
    const dataRows = lines.slice(1); // Supposer une en-tête

    let count = 0;
    for (const line of dataRows) {
      const [timestamp, temp, hum] = line.split(',');
      if (timestamp && temp && hum) {
        await Donnee.create({
          temp: parseFloat(temp),
          hum: parseFloat(hum),
          date: new Date(timestamp)
        });
        count++;
      }
    }

    // Supprimer le fichier temporaire
    await fs.unlink(req.file.path);

    res.status(200).json({
      message: '✅ Données déchiffrées et sauvegardées',
      rowsProcessed: count
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({
      message: 'Erreur de traitement',
      error: error.message
    });
  }
});

module.exports = router;

