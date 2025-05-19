import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# Charger le dataset enrichi
df = pd.read_csv("ddos_encodé_features.csv")
df.columns = df.columns.str.strip()

# Séparation X / y
X = df.drop(["label", "type"], axis=1)
y = df["label"]

# Split
test_size = 0.2
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=test_size, stratify=y, random_state=42
)

# Modèle XGBoost
model = XGBClassifier(
    n_estimators=500,
    max_depth=3,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    use_label_encoder=False,
    eval_metric="logloss",
    random_state=42
)
model.fit(X_train, y_train)

# Évaluation
y_pred = model.predict(X_test)
print("\n✅ Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

# Sauvegarde du modèle
joblib.dump(model, "xgb_model.pkl")
print("\n📅 Modèle sauvegardé dans 'xgb_model.pkl'")