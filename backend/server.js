const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth'); 
const donneeRoutes = require('./routes/donneeRoutes'); // ✅ Ajouté
const statsRoutes = require('./routes/stats'); // ajouté



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.error("Erreur MongoDB:", err));

require("./mqtt-handler"); // ⬅️ pour lancer l’écoute MQTT(ajouté)

// ✅ Ajout de la route d'authentification
app.use('/api', authRoutes);

// Routes utilisateurs
app.use('/api/users', userRoutes);

app.use('/api/donnees', donneeRoutes); // ajouté

app.use('/api/stats', statsRoutes); //ajouté

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

const path = require("path");

// 👉 Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// 👉 Intercepter toutes les autres routes (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

