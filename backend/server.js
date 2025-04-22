const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const donneeRoutes = require('./routes/donneeRoutes'); // ✅ Ajouté
const statsRoutes = require('./routes/stats'); // ajouté
const bodyParser = require('body-parser'); // ajouté

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Middleware pour parser les requêtes avec des données encodées en URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Autoriser uniquement le frontend local
  credentials: true,
}));
app.use(express.json());

// Middleware pour parser les requêtes JSON

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.error("Erreur MongoDB:", err));

// Vérification de la connexion MongoDB
mongoose.connection.on('connected', () => {
  console.log('Connexion MongoDB établie avec succès');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion MongoDB:', err);
});


// ✅ Ajout de la route d'authentification


// Routes utilisateurs
require("./mqtt-handler"); // ⬅️ pour lancer l’écoute MQTT(ajouté)
app.use('/api/users', userRoutes);

app.use('/api/donnees', donneeRoutes); // ajouté

app.use('/api/stats', statsRoutes); //ajouté

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

const path = require("path");

// Vérification si le serveur est en mode production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API en mode développement');
  });
}

