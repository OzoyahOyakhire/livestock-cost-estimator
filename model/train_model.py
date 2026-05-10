import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# 1. Load
data = pd.read_csv("dataset/livestock_data.csv")

# 2. Encode all categorical columns from the Wizard
encoders = {}
categorical_cols = [
    "livestockType", "productionType", "productionSystem", 
    "location", "housingType", "vaccinationProgram", 
    "vetServiceFrequency", "medicationIntensity"
]

for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    encoders[col] = le

# 3. Features (X) and Target (y)
X = data.drop(columns=["totalCostEstimation"])
y = data["totalCostEstimation"]

# 4. Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Save
if not os.path.exists("saved_model"):
    os.makedirs("saved_model")

joblib.dump(model, "saved_model/livestock_model.pkl")
joblib.dump(encoders, "saved_model/all_encoders.pkl")

print("AI Model successfully trained on Wizard-aligned data!")