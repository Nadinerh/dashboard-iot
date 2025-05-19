const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const { PythonShell } = require('python-shell');


// Chargement des routes
const userRoutes = require('./routes/userRoutes');
const donneeRoutes = require('./routes/donneeRoutes');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload'); 

// Chargement des variables d'environnement
dotenv.config();
const app = express();

// Middleware de base
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

const Stat = require("./models/Stat");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // max 100 requêtes/minute
  handler: (req, res) => {
    console.log("IP bloquée :", req.ip);  // ← tu dois voir ça dans le terminal
    Stat.create({
      type: 'DDoS',
      ip: req.ip,
      timestamp: new Date(),
      detail: "Blocage automatique via rate-limit"
    }).then(() => {
      console.log("Attaque enregistrée !");
    }).catch(err => {
      console.error("Erreur MongoDB :", err);
    });


    res.status(429).json({ message: "IP bloquée : DDoS détecté" });
  }
});

// IMPORTANT : doit être placé avant les routes !
app.use(limiter);

app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);


// CORS sécurisé
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("Connecté à MongoDB Atlas");
  console.log(`Base: test`);
})
.catch(err => {
  console.error("Erreur de connexion MongoDB:", err.message);
  process.exit(1);
});

// Monitoring de la connexion
mongoose.connection.on('connected', () => {
  console.log('Connexion MongoDB maintenue');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB déconnecté');
});

// Déclaration des routes
app.use('/api/users', userRoutes);
app.use('/api/donnees/all', donneeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Fonction pour trouver Python
function findPythonPath() {
  const possiblePaths = [
    'python',
    'python3',
    'C:\\Python311\\python.exe',
    'C:\\Python310\\python.exe',
    'C:\\Python39\\python.exe',
    'C:\\Python38\\python.exe'
  ];

  for (const pythonPath of possiblePaths) {
    try {
      require('child_process').execSync(`${pythonPath} --version`);
      return pythonPath;
    } catch (e) {
      continue;
    }
  }
  return null;
}

// Démarrage du TCP Blocker
function startTcpBlocker() {
  const pythonPath = findPythonPath();
  if (!pythonPath) {
    console.error(" Python n'est pas installé. Veuillez installer Python depuis python.org");
    return;
  }

  console.log("Démarrage du TCP Blocker...");
  
  const pythonProcess = new PythonShell(
    path.join(__dirname, 'ai', 'tcp_blocker.py'),
    { 
      pythonPath: pythonPath,
      pythonOptions: ['-u'],
      mode: 'text',
    }
  );

  pythonProcess.on('message', function(message) {
    console.log("TCP Blocker:", message);
  });

  pythonProcess.on('error', function(err) {
    console.error("Erreur TCP Blocker:", err.message);
  });

  pythonProcess.on('close', function() {
    console.log("TCP Blocker s'est arrêté, redémarrage...");
    setTimeout(startTcpBlocker, 5000); // Redémarrage après 5 secondes
  });

  process.on('SIGINT', () => {
    console.log("Arrêt du TCP Blocker...");
    pythonProcess.kill();
    process.exit();
  });
}

// Port/Host
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
  const networkInterfaces = require('os').networkInterfaces();
  console.log('IP locales disponibles :');
  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === 'IPv4') {
        console.log(`   - ${ifname}: http://${iface.address}:${PORT}`);
      }
    });
  });
  
  // Démarrer le TCP Blocker après le serveur
  startTcpBlocker();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 10)); // simule un traitement
  res.send('API');
});
}
app.use((req, res, next) => {
  console.log("IP reçue :", req.ip); // diagnostic IP
  next();
});

const analyseRoute = require('./routes/analyseRoutes');
app.use('/api/analyse', analyseRoute);











