# Guide de Test Complet

## 1. Configuration Initiale

### Backend (.env)
```bash
PORT=5000
HOST=192.168.137.1
MONGODB_URI=mongodb://localhost:27017/iot-dashboard
JWT_SECRET=your-secret-key
CLE_SECRETE=s1e2c3r4e5t
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
AES_PASSWORD=nour
FRONTEND_URL=http://192.168.137.1:3000
ENCRYPTION_KEY=nour
ENCRYPTION_IV=nour
```

### Frontend (.env)
```bash
HOST=192.168.137.1
PORT=3000
REACT_APP_BACKEND_IP=http://192.168.137.1:5000
```

## 2. Démarrage des Services

1. **MongoDB**
```bash
mongod --dbpath=/chemin/vers/data
```

2. **Backend**
```bash
cd backend
npm install
npm start
```

3. **Frontend**
```bash
cd frontend
npm install
npm start
```

## 3. Tests des Routes API avec Postman

### 3.1 Authentification

#### Register
```http
POST http://192.168.137.1:5000/api/users/register
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123",
    "cle": "s1e2c3r4e5t"
}
```

#### Login
```http
POST http://192.168.137.1:5000/api/users/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

### 3.2 Données IoT

#### Générer des données de test
```http
POST http://192.168.137.1:5000/api/donnees/all/generate-test-data
Authorization: Bearer votre_token_jwt
```

#### Récupérer les données
```http
GET http://192.168.137.1:5000/api/donnees/all
Authorization: Bearer votre_token_jwt
```

### 3.3 Upload de fichier depuis Raspberry Pi

1. Sur le Raspberry Pi, créez un script Python:
```python
import requests
import os

file_path = '/chemin/vers/encrypted_sensor_data.enc'
url = 'http://192.168.137.1:5000/api/upload'

with open(file_path, 'rb') as f:
    files = {'file': f}
    response = requests.post(url, files=files)
    print(response.json())
```

2. Exécutez le script:
```bash
python3 upload_script.py
```

## 4. Tests Frontend

1. Ouvrez http://192.168.137.1:3000

2. Testez les fonctionnalités:
   - Inscription avec clé secrète
   - Connexion
   - Visualisation du dashboard
   - Déconnexion
   - Mot de passe oublié

## 5. Tests de Sécurité

1. **Test JWT**
   - Tentez d'accéder au dashboard sans token
   - Utilisez un token expiré
   - Utilisez un token invalide

2. **Test Upload**
   - Tentez d'uploader un fichier non chiffré
   - Testez avec un fichier trop grand
   - Testez avec un type de fichier incorrect

3. **Test Clé Secrète**
   - Tentez de s'inscrire avec une mauvaise clé
   - Tentez de réinitialiser le mot de passe avec une mauvaise clé

## 6. Tests de Performance

1. **Génération de données**
```bash
curl -X POST http://192.168.137.1:5000/api/donnees/all/generate-test-data
```

2. **Surveillance MongoDB**
```bash
mongosh
use iot-dashboard
db.donnees.stats()
```

## 7. Débogage

### Logs Backend
```bash
tail -f backend/logs/error.log
```

### Logs Frontend (Console Chrome)
1. Ouvrez les DevTools (F12)
2. Onglet Console
3. Vérifiez les requêtes dans l'onglet Network

## 8. Tests de Récupération

1. **Test de récupération de mot de passe**
   - Demandez une réinitialisation
   - Vérifiez la réception de l'email
   - Testez le lien de réinitialisation

2. **Test de reconnexion**
   - Coupez le serveur backend
   - Vérifiez la gestion d'erreur frontend
   - Redémarrez le serveur
   - Vérifiez la reprise automatique
