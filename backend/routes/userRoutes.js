const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Increased to 24 hours
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { email, password, cle } = req.body;

  // 🔒 Clé secrète définie dans .env ou codée ici (ex: "abc123")
  const CLE_ATTENDUE = process.env.CLE_SECRETE || "s1e2c3r4e5t";

  if (cle !== CLE_ATTENDUE) {
    return res.status(403).json({ message: "Clé d'inscription invalide" });
  }

  try {
    const alreadySignUp = await User.findOne({ email });
    if (alreadySignUp) {
      return res.status(401).json({ message: "already sign up" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "saved", success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Get all users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Get a single user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Update a user by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, ...(hashedPassword && { password: hashedPassword }) },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur mis à jour", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Delete a user by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    console.log("🔗 Lien de réinitialisation :", resetLink);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `<p>Clique ici pour changer ton mot de passe :</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.status(200).json({ message: "Email envoyé." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password, cle } = req.body;

  const CLE_ATTENDUE = process.env.CLE_SECRETE || "s1e2c3r4e5t";
  if (cle !== CLE_ATTENDUE) {
    return res.status(403).json({ message: "Clé secrète invalide" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Lien invalide ou expiré" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
