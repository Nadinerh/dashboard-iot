const express = require('express');
const router = express.Router();
const Donnee = require('../models/Donnee');

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
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Reformater pour le frontend
    const formatted = results.map(entry => ({
      hour: `${entry._id}:00`,
      traffic: entry.count
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
