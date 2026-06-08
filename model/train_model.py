"""
LivestockIQ — ML Model Training Script
=======================================
Trains four separate regression models (one per target):
  - totalCostEstimation
  - projectedRevenue
  - projectedProfit
  - roi

Uses GradientBoostingRegressor (best for this tabular, mixed-type data).
Saves each model as a .pkl file that the Express backend loads via
a small Python inference server (see inference_server.py).

Run:
    pip install scikit-learn pandas numpy joblib
    python train_model.py
"""

import pandas as pd
import numpy as np
import joblib, os, json
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score

# ── 1. LOAD DATA ──────────────────────────────────────────────────────────────
DATA_PATH  = "dataset/livestock_training_data.csv"
MODEL_DIR  = "saved_model"
os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)
print(f"Loaded {len(df)} rows  |  columns: {list(df.columns)}\n")


# ── 2. FEATURE ENGINEERING ───────────────────────────────────────────────────
# Encode boolean → int
df["hasHousing"] = df["hasHousing"].astype(int)

# One useful derived feature: cost per animal head (gives the model scale context)
df["feedPerAnimal"]    = df["feedPrice"]    / df["numberOfAnimals"].clip(lower=1)
df["laborPerAnimal"]   = df["laborCost"]    / df["numberOfAnimals"].clip(lower=1)
df["electricPerAnimal"]= df["electricityCost"] / df["numberOfAnimals"].clip(lower=1)

CATEGORICAL_FEATURES = [
    "livestockType",
    "productionType",
    "productionSystem",
    "location",
    "housingType",
    "vaccinationProgram",
    "vetServiceFrequency",
    "medicationIntensity",
    "diseaseRiskLevel",
]

NUMERIC_FEATURES = [
    "numberOfAnimals",
    "cycleDuration",
    "hasHousing",
    "capacity",
    "equipmentCount",
    "feedPrice",
    "laborCost",
    "electricityCost",
    "mortalityRate",
    "sellingPricePerKg",
    "eggPricePerEgg",
    "milkPricePerLiter",
    # derived
    "feedPerAnimal",
    "laborPerAnimal",
    "electricPerAnimal",
]

TARGETS = [
    "totalCostEstimation",
    "projectedRevenue",
    "projectedProfit",
    "roi",
]

X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
y = df[TARGETS]


# ── 3. PRE-PROCESSING PIPELINE ────────────────────────────────────────────────
preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1),
            CATEGORICAL_FEATURES,
        ),
        (
            "num",
            StandardScaler(),
            NUMERIC_FEATURES,
        ),
    ]
)


# ── 4. TRAIN ONE MODEL PER TARGET ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

results = {}

for target in TARGETS:
    print(f"─── Training model for: {target} ───")

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "regressor",
                GradientBoostingRegressor(
                    n_estimators=300,
                    learning_rate=0.05,
                    max_depth=5,
                    min_samples_split=5,
                    subsample=0.8,
                    random_state=42,
                ),
            ),
        ]
    )

    model.fit(X_train, y_train[target])

    y_pred   = model.predict(X_test)
    mae      = mean_absolute_error(y_test[target], y_pred)
    r2       = r2_score(y_test[target], y_pred)
    cv_r2    = cross_val_score(model, X, y[target], cv=5, scoring="r2").mean()

    print(f"  MAE : ₦{mae:>14,.2f}")
    print(f"  R²  :  {r2:.4f}")
    print(f"  CV R²: {cv_r2:.4f}\n")

    results[target] = {"mae": round(mae, 2), "r2": round(r2, 4), "cv_r2": round(cv_r2, 4)}

    # Save model
    model_path = os.path.join(MODEL_DIR, f"{target}_model.pkl")
    joblib.dump(model, model_path)
    print(f"  ✅ Saved → {model_path}\n")

# Save feature list so the inference server uses the exact same column order
feature_meta = {
    "categorical_features": CATEGORICAL_FEATURES,
    "numeric_features": NUMERIC_FEATURES,
    "targets": TARGETS,
    "all_features": CATEGORICAL_FEATURES + NUMERIC_FEATURES,
}
with open(os.path.join(MODEL_DIR, "feature_meta.json"), "w") as f:
    json.dump(feature_meta, f, indent=2)

print("═══ TRAINING COMPLETE ═══")
print(json.dumps(results, indent=2))
