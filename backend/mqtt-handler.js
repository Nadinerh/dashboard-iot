// 📦 Import des modules
const https = require('https');
const fs = require('fs');
const express = require('express');
const mqtt = require("mqtt");
const Donnee = require("./models/Donnee"); // ← Ton modèle Mongoose

const app = express();

// 🛡️ Chargement des certificats HTTPS (mkcert)
const httpsOptions = {
  key: fs.readFileSync('./certs/https/localhost+1-key.pem'),
  cert: fs.readFileSync('./certs/https/localhost+1.pem')
};

// 🌐 Middleware JSON pour l’API
app.use(express.json());

// ✅ Route de test API
app.get('/api/test', (req, res) => {
  res.json({ message: '🔐 API sécurisée en HTTPS fonctionne !' });
});

// 🌡️ Route pour obtenir toutes les données DHT11
app.get('/api/donnees', async (req, res) => {
  try {
    const donnees = await Donnee.find().sort({ createdAt: -1 }).limit(50);
    res.json(donnees);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

// 🚀 Lancer le serveur HTTPS Express
https.createServer(httpsOptions, app).listen(443, () => {
  console.log("✅ Serveur Express HTTPS démarré sur https://localhost");
});

// 🔌 Connexion au broker MQTT sécurisé
const mqttOptions = {
  host: "192.168.137.46", // ← IP Raspberry/Mosquitto
  port: 8883,
  protocol: "mqtts",
  username: "esp32",
  password: "nour123@AZERTY",
  ca: fs.readFileSync("./certs/ca.crt"), // Certificat du broker Mosquitto
  rejectUnauthorized: false
};

const client = mqtt.connect(mqttOptions);

// 🛰️ Événements MQTT
client.on("connect", () => {
  console.log("📡 Connecté au broker MQTT");
  client.subscribe("esp32/dht11", () => {
    console.log("📥 Abonné au topic : esp32/dht11");
  });
});

client.on("message", async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log("🌡️ Donnée reçue :", payload);
    await Donnee.create(payload); // Stocke dans MongoDB
  } catch (err) {
    console.error("❌ Erreur MQTT → MongoDB :", err.message);
  }
});
