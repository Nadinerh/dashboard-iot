const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");

// Chargement des routes
const userRoutes = require('./routes/userRoutes');
const donneeRoutes = require('./routes/donneeRoutes');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload'); // ← utilise upload.js corrigé

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middleware de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS sécurisé
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connecté"))
.catch(err => console.error("❌ Erreur MongoDB:", err));

// Affichage IP locales
mongoose.connection.on('connected', () => {
  console.log('🔌 Connexion MongoDB établie avec succès');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion MongoDB:', err);
});

// Déclaration des routes
app.use('/api/users', userRoutes);
app.use('/api/donnees/all', donneeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Port/Host
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT}`);
  const networkInterfaces = require('os').networkInterfaces();
  console.log('📡 IP locales disponibles :');
  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === 'IPv4') {
        console.log(`   - ${ifname}: http://${iface.address}:${PORT}`);
      }
    });
  });
});

// Production : servir le frontend compilé
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('🌐 API en mode développement');
  });
}



