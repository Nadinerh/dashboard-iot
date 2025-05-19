const express = require('express');
const { PythonShell } = require('python-shell');
const path = require('path');
const router = express.Router();
const Detection = require('../models/Detection');

router.post('/', async (req, res) => {
  const input = req.body;
  console.log("🧠 Analyse IA reçue :", input);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, '../ai'),
    args: [JSON.stringify(input)]
  };

  const pyShell = new PythonShell('predictor.py', options);

  let predictionNum = null;

  pyShell.on("message", (message) => {
    console.log("✅ Résultat IA brut :", message);
    predictionNum = parseInt(message); // 👈 Convertir en number (0 ou 1)
  });

  pyShell.on("stderr", (stderr) => {
    console.error("❌ Erreur Python :", stderr);
  });

  pyShell.end(async (err) => {
    if (err || predictionNum === null) {
      console.error("⛔ Script terminé avec erreur :", err);
      return res.status(500).json({ error: "Erreur IA", details: err?.message || "Aucune réponse IA" });
    }

    try {
      await Detection.create({
        timestamp: new Date().toLocaleTimeString(),
        prediction: predictionNum, // ✅ Enregistrement en tant que nombre
      });
    } catch (e) {
      console.error("❌ Erreur enregistrement MongoDB :", e.message);
    }

    // Réponse lisible pour le frontend
    res.json({ prediction: predictionNum === 1 ? "DDoS" : "Normal" });
  });
});

// ✅ Route GET /history pour le dashboard
router.get('/history', async (req, res) => {
  try {
    const results = await Detection.find().sort({ _id: -1 }).limit(20);
    res.json(results.reverse());
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération historique IA" });
  }
});

module.exports = router;


