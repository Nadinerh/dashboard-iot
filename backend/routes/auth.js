const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Exemple d’utilisateur en dur (à remplacer par MongoDB plus tard)
const user = {
  email: "test@example.com",
  password: "123456"  // ⚠ à ne jamais stocker comme ça en prod
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifie l'utilisateur
  if (email === user.email && password === user.password) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Identifiants invalides" });
  }
});

module.exports = router;
