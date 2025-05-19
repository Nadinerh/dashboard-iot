const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path");
const fs = require("fs").promises;
const EncryptedData = require("../models/EncryptedData"); 
const Donnee = require("../models/Donnee");
const { decryptData } = require('../services/decryptionService');

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

    console.log('Fichier reçu:', req.file.path);

    // Sauvegarder le fichier chiffré dans MongoDB
    const fileContent = await fs.readFile(req.file.path);
    const encryptedDoc = await EncryptedData.create({
      encryptedContent: fileContent.toString('base64'),
      status: 'pending'
    });

    // Déchiffrer et traiter
    try {
      const decryptedBuffer = await decryptData(fileContent);
      const decrypted = decryptedBuffer.toString('utf8');

      // Parser et sauvegarder les données
      const lines = decrypted.split('\n').filter(Boolean);
      const dataRows = lines.slice(1);

      for (const line of dataRows) {
        const [timestamp, temp, hum] = line.split(',');
        await Donnee.create({
          temp: parseFloat(temp),
          hum: parseFloat(hum),
          date: new Date(timestamp)
        });
      }

      // Mettre à jour le statut
      encryptedDoc.status = 'decrypted';
      encryptedDoc.decryptedContent = decrypted;
      await encryptedDoc.save();

    } catch (decryptError) {
      encryptedDoc.status = 'error';
      await encryptedDoc.save();
      throw decryptError;
    }

    // Nettoyer le fichier temporaire
    await fs.unlink(req.file.path);

    res.status(200).json({
      message: 'Données traitées et sauvegardées dans MongoDB Atlas',
      id: encryptedDoc._id
    });

  } catch (error) {
    console.error('Erreur:', error.message);
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({
      message: 'Erreur de traitement',
      error: error.message
    });
  }
});

// Route pour vérifier le statut des fichiers
router.get('/status', async (req, res) => {
  try {
    const files = await EncryptedData.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('timestamp status');
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


