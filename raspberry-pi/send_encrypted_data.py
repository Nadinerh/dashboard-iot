import requests
import time
import os
import sys
from datetime import datetime
import subprocess

BACKEND_URL = 'http://192.168.137.1:5000/api/upload'
FILE_PATH = '/home/moncompteiot/secure_iot/encrypted_sensor_data.enc'
LOG_FILE = '/home/moncompteiot/secure_iot/send_log.txt'

def log(msg):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{timestamp}] {msg}"
    with open(LOG_FILE, 'a') as f:
        f.write(line + '\n')
    print(line)

def check_network():
    try:
        res = requests.head(BACKEND_URL, timeout=5)
        return res.status_code < 500
    except:
        return False

def send_file():
    if not os.path.exists(FILE_PATH):
        log("❌ Fichier introuvable")
        return False

    file_size = os.path.getsize(FILE_PATH)
    if file_size == 0:
        log("❌ Fichier vide")
        return False

    log(f"📁 Taille fichier : {file_size} bytes")
    with open(FILE_PATH, 'rb') as f:
        files = {'file': ('encrypted_sensor_data.enc', f, 'application/octet-stream')}
        try:
            log("📤 Envoi du fichier...")
            res = requests.post(BACKEND_URL, files=files, timeout=30)
            log(f"📡 Statut: {res.status_code}")
            log(f"💬 Réponse: {res.text}")
            return res.status_code == 200
        except Exception as e:
            log(f"❌ Erreur d'envoi: {e}")
            return False

if __name__ == "__main__":
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    log("🚀 Lancement de l’envoi...")
    retries = 3
    while retries > 0:
        if send_file():
            log("✅ Fichier envoyé avec succès")
            break
        else:
            retries -= 1
            log(f"🔁 Nouvelle tentative... ({3 - retries}/3)")
            time.sleep(5)

