# ai/predictor.py
import sys
import json
import os
import pandas as pd
import joblib

# Lire l'input JSON passé en argument
input_json = sys.argv[1]
donnee = json.loads(input_json)

# Déterminer le chemin absolu vers le modèle
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "..", "DDoS", "xgb_model.pkl")

# Charger le modèle
model = joblib.load(model_path)

# Conversion en DataFrame
df = pd.DataFrame([donnee])

# Prédiction
pred = model.predict(df)[0]

# Affiche "1" (attaque) ou "0" (normal) pour que Node.js le récupère
print(int(pred))





