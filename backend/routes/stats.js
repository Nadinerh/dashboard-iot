const express = require('express');
const router = express.Router();
const Donnee = require('../models/Donnee');
const Stat = require('../models/Stat');
const bodyParser = require('body-parser');

// Middleware pour parser les requêtes
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// 📊 Route 1 : trafic capteurs (par heure)
router.get('/hourly', async (req, res) => {
  try {
    const results = await Donnee.aggregate([
      {
        $group: {
          _id: {
            $hour: { $toDate: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formatted = results.map(entry => ({
      hour: `${entry._id}:00`,
      traffic: entry.count
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚨 Route 2 : attaques détectées (DDoS)
router.get('/attacks', async (req, res) => {
  try {
    const attaques = await Stat.find({ type: "DDoS" }).sort({ timestamp: -1 }).limit(50);
    res.json(attaques);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

