import pandas as pd

df = pd.read_csv("ddos_encodé_features.csv")

# ligne normale
ligne_normale = df[df["label"] == 0].iloc[0].drop(["label", "type"]).to_dict()

# ligne attaque
ligne_ddos = df[df["label"] == 1].iloc[0].drop(["label", "type"]).to_dict()

print("✅ Ligne normale :")
print(ligne_normale)
print("\n🚨 Ligne DDoS :")
print(ligne_ddos)
