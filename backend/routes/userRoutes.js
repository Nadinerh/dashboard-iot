const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();

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
  
  if (cle !== process.env.CLE_SECRETE) {
    return res.status(403).json({ message: "Clé d'inscription invalide" });
  }

  try {
    const alreadySignUp = await User.findOne({ email });
    if (alreadySignUp) {
      return res.status(401).json({ message: "already sign up" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword }); // Fixed: Ensure `new` keyword is used
    await newUser.save();
    res.status(201).json({ message: "saved", success: true });
  } catch (error) {
    console.error("Error during registration:", error); // Log the error for debugging
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

// Route de réinitialisation du mot de passe
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 heure
    await user.save();

    // Configurer l'envoi d'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html: `
        <p>Vous avez demandé une réinitialisation de mot de passe</p>
        <p>Cliquez sur ce lien pour réinitialiser: 
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">
          Réinitialiser le mot de passe
        </a></p>
      `
    });

    res.json({ message: 'Email envoyé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route de reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/history', async (req, res) => {
  try {
    const results = await Detection.find().sort({ _id: -1 }).limit(20);
    res.json(results.reverse()); // plus récents en dernier
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération historique IA' });
  }
});


module.exports = router;
