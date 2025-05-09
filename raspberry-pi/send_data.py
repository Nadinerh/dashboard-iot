import time
import csv
import requests
from datetime import datetime
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
import os

# Configuration
BACKEND_URL = 'http://192.168.137.1:5000/api/upload'
PASSWORD = 'nour'  # Même mot de passe que dans le backend
SALT = b'iot-project-2025'
OUTPUT_FILE = 'encrypted_sensor_data.enc'

def generate_key():
    return PBKDF2(PASSWORD, SALT, dkLen=32, count=100000)

def encrypt_data(data, key):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = data + (16 - len(data) % 16) * chr(16 - len(data) % 16)
    encrypted = cipher.encrypt(padded_data.encode())
    return iv + encrypted

def collect_sensor_data():
    # Simuler des données de capteur pour test
    # Remplacer par votre code réel pour lire le capteur DHT11
    temp = 25 + (time.time() % 5)
    hum = 60 + (time.time() % 10)
    return temp, hum

def main():
    key = generate_key()
    
    while True:
        try:
            # Collecter les données
            temp, hum = collect_sensor_data()
            timestamp = datetime.now().isoformat()
            
            # Créer CSV en mémoire
            csv_data = "timestamp,temperature,humidity\n"
            csv_data += f"{timestamp},{temp:.1f},{hum:.1f}\n"
            
            # Chiffrer
            encrypted_data = encrypt_data(csv_data, key)
            
            # Sauvegarder
            with open(OUTPUT_FILE, 'wb') as f:
                f.write(encrypted_data)
            
            # Envoyer au serveur
            with open(OUTPUT_FILE, 'rb') as f:
                files = {'file': f}
                response = requests.post(BACKEND_URL, files=files)
                print(f"Données envoyées: {response.status_code}")
            
            # Attendre 5 secondes
            time.sleep(5)
            
        except Exception as e:
            print(f"Erreur: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
