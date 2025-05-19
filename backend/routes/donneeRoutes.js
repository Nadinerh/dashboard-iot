const express = require('express');
const router = express.Router();
const Donnee = require('../models/Donnee');
const authenticateToken = require('../middleware/authenticateToken');
const bodyParser = require('body-parser');

// Middleware pour parser les requêtes JSON
router.use(bodyParser.json());

// Middleware pour parser les requêtes avec des données encodées en URL
router.use(bodyParser.urlencoded({ extended: true }));

// GET /api/donnees → Récupère les 10 dernières données
router.get('/', authenticateToken, async (req, res) => {
  try {
    const data = await Donnee.find().sort({ date: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Route pour générer des données de test
router.post('/generate-test-data', async (req, res) => {
  try {
    const numberOfPoints = 50; 
    const testData = [];
    
    for (let i = 0; i < numberOfPoints; i++) {
      const temp = (20 + Math.random() * 10).toFixed(1); 
      const hum = (50 + Math.random() * 30).toFixed(1); 
      
      const donnee = new Donnee({
        temp: parseFloat(temp),
        hum: parseFloat(hum),
        date: new Date(Date.now() - (numberOfPoints - i) * 60000) // Une minute d'intervalle
      });
      
      await donnee.save();
      testData.push(donnee);
    }
    
    res.status(201).json({
      message: `${numberOfPoints} points de données générés avec succès`,
      data: testData
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la génération des données', error: err.message });
  }
});

module.exports = router;
