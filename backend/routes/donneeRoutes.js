const express = require('express');
const router = express.Router();
const Donnee = require('../models/Donnee');
const authenticateToken = require('../middleware/authenticateToken');

// 🔒 GET /api/donnees → Récupère les 10 dernières données
router.get('/', authenticateToken, async (req, res) => {
  try {
    const data = await Donnee.find().sort({ date: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
